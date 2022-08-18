import {BaseService} from "../common/controllers/base.service";
import {Comment} from "../models/Comment";
import {CommentRepository} from "../repositories/comment.repository";
import {Order} from "../models/Order";
import {CommentEntities} from "../common/enum/commentEntities";

export class CommentService extends BaseService<Comment> {
    constructor(
        private readonly commentRepository: CommentRepository<Comment>
    ){
        super(commentRepository);
    }

    async getByOrder(order: Order){

        const field = {"entity": CommentEntities.ORDER, "idRelated": order.id};
        const relations = ["user"];
        const limit = 5;

        let comments = await this.commentRepository.findByObjectWithLimit(field, relations, limit)
        ;
        return comments;
    }

    async getByOders(order: Order[]){

        let comments = await this.commentRepository.createQueryBuilder('c')
            .where('idRelated IN (:orders)')
            .andWhere('entity = :entity')
            .orderBy('id', 'DESC')
            .setParameters({entity: CommentEntities.ORDER, orders: order.map(item => item.id)})
            .getMany();

        return comments;
    }
}
