import {BaseController, GROUPS} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {POST, PUT, route} from "awilix-express";
import {Comment} from "../models/Comment";
import {CommentService} from "../services/comment.service";
import {Request, Response} from "express";
import {InvalidArgumentException} from "../common/exceptions";
import {CustomerService} from "../services/customer.service";
import {OrderService} from "../services/order.service";
import {CommentListDTO} from "./parsers/comment";
import {User} from "../models/User";
import {UserService} from "../services/user.service";

@route('/comment')
export class CommentController extends BaseController<Comment> {
    constructor(
        protected readonly commentService: CommentService,
        protected readonly userService: UserService,
        private readonly customerService: CustomerService,
        private readonly orderService: OrderService
    ){
        super(commentService, userService);
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
       return CommentListDTO(entity);
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

            const user = await this.getUser(req);
            body.idRelated = _entity.id;
            body.user = user.id; //Temporalmente..

            let entity = await this.parseObject(this.getInstance(), req.body);
            entity = this.getParsePOST(entity);

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

    async getUser(req: Request) : Promise<User>{
        if(this.userService && req['user'] && req['user'].id) {
            const userIdFromSession = req['user'].id;
            const user = await this.userService.find(userIdFromSession);
            return user;
        }
    }

    protected getDefaultRelations(isDetail: boolean): Array<string> {
        if(isDetail){
            return ['user'];
        } else {
            return ['user'];
        }
    }

    getGroupRelations(): Array<string> {
        return [];
    }
}
