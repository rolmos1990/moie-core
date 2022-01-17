import {BaseService} from "../common/controllers/base.service";
import {Comment} from "../models/Comment";
import {CommentRepository} from "../repositories/comment.repository";
import {Order} from "../models/Order";

export class CommentService extends BaseService<Comment> {
    constructor(
        private readonly commentRepository: CommentRepository<Comment>
    ){
        super(commentRepository);
    }

    async getByOrder(order: Order){

        const field = {"entity": "Order", "idRelated": order.id};
        const relations = ["user"];
        const limit = 5;

        let comments = await this.commentRepository.findByObjectWithLimit(field, relations, limit)
        ;
        return comments;
    }
}
