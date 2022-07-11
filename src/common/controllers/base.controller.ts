import {Request, Response} from 'express';
import {DELETE, GET, POST, PUT, route} from "awilix-express";
import {ConditionalQuery} from "./conditional.query";
import {PageQuery} from "./page.query";
import {IService} from "../interfaces/IService";
import {validate, ValidationError} from "class-validator";
import {EntityTarget, getConnection} from "typeorm";
import {OperationQuery} from "./operation.query";
import {PageDTO} from "../../controllers/parsers/page";
import {ApplicationException, ConditionalException, InvalidArgumentException} from "../exceptions";
import {OrderConditional} from "../enum/order.conditional";
import {isEmpty} from "../helper/helpers";
import {User} from "../../models/User";
import {IBuilderParamsOrder} from "../interfaces/IBuilderParamsOrder";
import {IBuilderParamsPage} from "../interfaces/IBuilderParamsPage";
import {UserService} from "../../services/user.service";

export const GROUPS = {
    POST: 'create',
    PUT: 'update'
};

export abstract class BaseController<Parse> {
    protected constructor(
        protected readonly service: IService,
        protected readonly serviceAux?: IService,
        protected readonly userService?: UserService,
    ){
    };
    protected autoSaveUser?() : boolean; //save user in table
    protected customDefaultOrder?(page: PageQuery): void;
    protected getUserService?() : IService; //required for autosave user
    public abstract getInstance() : Object;
    public abstract getEntityTarget() : EntityTarget<Parse>;
    public abstract getParseGET(entity: Parse, isDetail: boolean) : Object;
    public abstract getParsePOST(entity: Parse) : Object;
    public abstract getParsePUT(entity: Parse) : Object;

    builderParamsPage(query) : IBuilderParamsPage{
        const conditional = query.conditional ? query.conditional + "" : null;
        const offset = query.offset ? query.offset + "" : "0";

        const pageNumber = parseInt(offset);
        const limit = query.limit ? parseInt(query.limit + "") : 100;
        const operation = query.operation ? query.operation + "" : null;
        const group = query.group ? query.group + "" : null;

        const queryCondition = ConditionalQuery.ConvertIntoConditionalParams(conditional);
        const operationQuery = new OperationQuery(operation, group);

        return {
            limit: limit,
            pageNumber: pageNumber,
            operationQuery: operationQuery,
            hasGroup: isEmpty(group),
            queryCondition: queryCondition,
            hasOperation: operation !== null,
        };
    }

    builderOrder(query) : IBuilderParamsOrder {
        //Order
        const order = query.order ? query.order + "" : undefined;
        const orderType = query.orderType ? query.orderType + "" : undefined;
        return {order, orderType};
    }

    async processPaginationIndex(page: PageQuery, parametersOrders: IBuilderParamsOrder, parametersQuery: IBuilderParamsPage){
        const {order, orderType} = parametersOrders;
//Ordenamiento por defecto
        if(order !== undefined && orderType !== undefined){
            const _type = orderType === "asc" ? OrderConditional.ASC : OrderConditional.DESC;
            page.addOrder(order, _type);
        } else if(this.customDefaultOrder){
            this.customDefaultOrder(page);
        } else if(!page.hasOperation() && (order === undefined && orderType === undefined)){
            page.addOrder('id', OrderConditional.DESC);
        }

        const countRegisters = await this.service.count(page);

        /** Relations by Default */
        if(this.getDefaultRelations(false)){
            page.setRelations(this.getDefaultRelations(false));
        }

        /** Relations with groups */
        if(this.getGroupRelations() && !parametersQuery.hasGroup){
            page.setRelations(this.getGroupRelations());
        }
        let items: Array<Object> = await this.service.all(page);

        if((items && items.length) > 0){
            items = await Promise.all(items.map(async item => await this.getParseGET(<Parse> item, false)));
        }

        const response = PageDTO(items || [], countRegisters, parametersQuery.pageNumber + 1, parametersQuery.limit);
        return response;
    }
    @GET()
    public async index(req: Request, res: Response) {
        try {
            const query = req.query;
            const parametersQuery = this.builderParamsPage(query);
            const parametersOrders = this.builderOrder(query);
            let page = new PageQuery(parametersQuery.limit,parametersQuery.pageNumber,parametersQuery.queryCondition, parametersQuery.operationQuery);

            const response = await this.processPaginationIndex(page, parametersOrders, parametersQuery);
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
            let relations = [];
            if(this.getDefaultRelations(true)){
                relations = this.getDefaultRelations(true);
            }
            const item = await this.service.find(id, relations);
            const result = await this.getParseGET(item, true);
            res.json(result);
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

            /** Autoasignar usuario a la creación */
            if(this.getUserService && req && req['user'] && this.autoSaveUser) {
                const userIdFromSession = req['user'].id;
                const user = await this.getUserService().find(userIdFromSession);
                entity.user = user;
            }

            await this.beforeCreate(entity);
            const response = await this.service.createOrUpdate(entity);
            await this.afterCreate(response);

            const newEntity = await this.service.find(response.id, this.getDefaultRelations(true) || []);
            const name = this.getEntityTarget()['name'];
            return res.json({status: 200, [name.toString().toLowerCase()]: newEntity});
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    @route('/:id')
    @PUT()
    public async update(req: Request, res: Response) {
        try {
            //add here
            const oldEntity = await this.service.find(req.params.id, this.getDefaultRelations(false));
            if(oldEntity) {
                let entity = await this.parseObject(oldEntity, req.body);
                entity = this.getParsePUT(entity);
                await this.beforeUpdate(entity, oldEntity);

                const errors = await this.validateEntity(entity, [GROUPS.PUT]);
                if (errors && errors.length > 0) {
                    const errorMessage = Object.values(errors[0].constraints || {})[0];
                    throw new InvalidArgumentException(errorMessage);
                }
                const response = await this.service.createOrUpdate(entity);

                if(this.afterUpdate) {
                    await this.afterUpdate(response, req);
                }

                return res.json({status: 200});
            }
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    @route('/:id')
    @DELETE()
    public async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await this.service.delete(id);
            return res.json({status: 200});
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    async parseObject(parse: any, _body: any){
        const entityTarget = this.getEntityTarget();
        const columns = await getConnection().getMetadata(entityTarget).ownColumns.map(column => column.propertyName);
        columns.forEach(i => parse[i] = _body[i] !== undefined ? _body[i] : parse[i]);
        return parse
    }

    async validateEntity(obj: Object, groups: Array<string> = [GROUPS.POST]): Promise<ValidationError[]>{
        //TODO -- para validar por grupos
        return await validate(obj, { groups });
    }

    /* get session user in any method from the controller */
    async getUser(req: Request) : Promise<User>{
        if(this.userService && req['user'] && req['user'].id) {
            const userIdFromSession = req['user'].id;
            const user = await this.userService.find(userIdFromSession);
            return user;
        }
    }

    /* define your relations for the entity */
    protected abstract getDefaultRelations(isDetail: boolean) : Array<string>;

    /* define your relations for the group */
    public abstract getGroupRelations() : Array<string>;

    /* Before create object in repository */
    protected abstract beforeCreate(item: Object): void;

    /* After create object in repository */
    protected abstract afterCreate(item: Object, user?: User): void;

    /* Before update object in repository */
    protected abstract beforeUpdate(item: Object, olditem?: Object): any;

    /* After update object in repository */
    protected abstract afterUpdate(item: Object, req? : Object): void;

    handleException(err: any, res: Response) {
        if (err.name === ApplicationException.name) {
            res.status(500);
            res.send({code: 500, error: err.message});
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
