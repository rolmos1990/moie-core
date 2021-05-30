import {BaseController, GROUPS} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {POST, PUT, route} from "awilix-express";
import {Comment} from "../models/Comment";
import {CommentService} from "../services/comment.service";
import {Request, Response} from "express";
import {InvalidArgumentException} from "../common/exceptions";
import {CustomerService} from "../services/customer.service";
import {OrderService} from "../services/order.service";
import BaseModel from "../common/repositories/base.model";

@route('/comment')
export class CommentController extends BaseController<Comment> {
    constructor(
        private readonly commentService: CommentService,
        private readonly customerService: CustomerService,
        private readonly orderService: OrderService
    ){
        super(commentService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<Comment> {
        return Comment;
    }

    getInstance(): Object {
        return new Comment();
    }

    getParseGET(entity: Comment, isDetail: boolean): Object {
       return entity;
    }

    getParsePOST(entity: Comment): Object {
        return entity;
    }

    getParsePUT(entity: Comment): Object {
        return entity;
    }

    /** TODO -- remover este es un ejemplo de petición
     * Ejemplo: .... http://{{base_url}}/{id_related}/comment
     body: {entity": "customer", comment": "Comentario de Prueba"}
     */
    @route('/:id')
    @POST()
    public async create(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const body = req.body;

            let _entity : any;

            switch(body.entity){
                case 'customer':
                    _entity = await this.customerService.find(parseInt(id));
                break;
                case 'order':
                    _entity = await this.orderService.find(parseInt(id));
                break;
            }

            if(!_entity){
                throw new InvalidArgumentException();
            }

            body.idRelated = _entity.id;
            body.user = 1; //Temporalmente..

            let entity = await this.parseObject(this.getInstance(), req.body);
            entity = this.getParsePOST(entity);

            console.log("entity", entity);

            const errors = await this.validateEntity(entity, [GROUPS.POST]);

            if(errors && errors.length > 0){
                const errorMessage = Object.values(errors[0].constraints || {})[0];
                throw new InvalidArgumentException(errorMessage);
            }

            await this.beforeCreate(entity);
            const response = await this.commentService.createOrUpdate(entity);
            await this.afterCreate(response);
            const newEntity = await this.commentService.find(response.id, this.getDefaultRelations(true) || []);
            const name = this.getEntityTarget()['name'];
            return res.json({status: 200, [name.toString().toLowerCase()]: newEntity});

        }catch(e){
            this.handleException(e, res);
        }
    }

    protected getDefaultRelations(isDetail: boolean): Array<string> {
        if(isDetail){
            return [];
        } else {
            return [];
        }
    }
}
