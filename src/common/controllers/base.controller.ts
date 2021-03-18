import {Request, Response} from 'express';
import {GET,POST, PUT, route} from "awilix-express";
import {ConditionalQuery} from "./conditional.query";
import {PageQuery} from "./page.query";
import {IService} from "../interfaces/IService";
import {validate, ValidationError} from "class-validator";
import {EntityTarget, getConnection} from "typeorm";
import {OperationQuery} from "./operation.query";
import {PageDTO} from "../../controllers/parsers/page";
import {ApplicationException, ConditionalException, InvalidArgumentException} from "../exceptions";

const GROUPS = {
    POST: 'create',
    PUT: 'update'
};

export abstract class BaseController<Parse> {
    constructor(
        private readonly service: IService
    ){
    };

    public abstract getInstance() : Object;
    public abstract getEntityTarget() : EntityTarget<Parse>;
    public abstract getParseGET(entity: Parse) : Object;
    public abstract getParsePOST(entity: Parse) : Object;
    public abstract getParsePUT(entity: Parse) : Object;

    @GET()
    public async index(req: Request, res: Response) {
        try {
            const query = req.query;
            const conditional = query.conditional ? query.conditional + "" : null;
            const pageNumber = query.page ? parseInt(query.offset + "") :  0;
            const limit = query.limit ? parseInt(query.limit + "") : 100;
            const operation = query.operation ? query.operation + "" : null;
            const group = query.group ? query.group + "" : null;

            const queryCondition = ConditionalQuery.ConvertIntoConditionalParams(conditional);
            const operationQuery = new OperationQuery(operation, group);
            const page = new PageQuery(limit,pageNumber,queryCondition, operationQuery);
            const countRegisters = await this.service.count(page);
            let items: Array<Object> = await this.service.all(page);

            if(items && items.length > 0){
                items = items.map(item => this.getParseGET(<Parse> item));
            }

            const response = PageDTO(items || [], countRegisters, pageNumber + 1, limit);
            res.json(response);
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    @route('/:id')
    @GET()
    public async find(req: Request, res: Response) {
        try {
            const query = req.params;
            const id = query.id;
            const item = await this.service.find(id);
            res.json(item);
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    @POST()
    public async create(req: Request, res: Response) {
        try {
            let entity = await this.parseObject(this.getInstance(), req.body);
            entity = this.getParsePOST(entity);


            const errors = await this.validateEntity(entity, [GROUPS.POST]);

            if(errors && errors.length > 0){
                    const errorMessage = Object.values(errors[0].constraints || {})[0];
                    throw new InvalidArgumentException(errorMessage);
            }

            this.beforeCreate(entity);
            console.log("ENTITY TO SAVE", entity);
            const response = await this.service.createOrUpdate(entity);
            this.afterCreate(response);

            return res.json({status: 200});
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    @route('/:id')
    @PUT()
    public async update(req: Request, res: Response) {
        try {
            const oldEntity = await this.service.find(req.params.id);
            if(oldEntity) {
                console.log("REQUEST BODY", req.body);
                let entity = await this.parseObject(oldEntity, req.body);
                console.log("NEW SAVE", entity);
                entity = this.getParsePUT(entity);
                console.log("ENTITY SAVED", entity);
                this.beforeUpdate(entity);

                const errors = await this.validateEntity(entity, [GROUPS.PUT]);
                if (errors && errors.length > 0) {
                    const errorMessage = Object.values(errors[0].constraints || {})[0];
                    throw new InvalidArgumentException(errorMessage);
                }
                const response = await this.service.createOrUpdate(entity);
                this.afterUpdate(response);

                return res.json({status: 200});
            }
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }
    async parseObject(parse: any, _body: any){
        const entityTarget = this.getEntityTarget();
        const columns = await getConnection().getMetadata(entityTarget).ownColumns.map(column => column.propertyName);
        columns.forEach(i => parse[i] = _body[i] ? _body[i] : parse[i]);
        return parse
    }

    async validateEntity(obj: Object, groups: Array<string> = [GROUPS.POST]): Promise<ValidationError[]>{
        //TODO -- para validar por grupos
        return await validate(obj, { groups });
    }

    /* Before create object in repository */
    protected abstract beforeCreate(item: Object): void;

    /* After create object in repository */
    protected abstract afterCreate(item: Object): void;

    /* Before update object in repository */
    protected abstract beforeUpdate(item: Object): void;

    /* After update object in repository */
    protected abstract afterUpdate(item: Object): void;

    handleException(err: any, res: Response) {
        if (err.name === ApplicationException.name) {
            res.status(400);
            res.send({code: 400, error: err.message});
        }
        else if(err.name === ConditionalException.name){
            res.status(400);
            res.send({code: 400, error: err.message});
        }
        else if(err.name === InvalidArgumentException.name){
            res.status(400);
            res.send({code: 400, error: err.message});
        }
        else {
            res.status(500);
            res.send({code: 500, error: err.message || "Ha ocurrido un error"});
        }
    }
}
