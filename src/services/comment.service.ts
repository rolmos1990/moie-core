import {BaseService} from "../common/controllers/base.service";
import {Comment} from "../models/Comment";
import {CommentRepository} from "../repositories/comment.repository";

export class CommentService extends BaseService<Comment> {
    constructor(
        private readonly commentRepository: CommentRepository<Comment>
    ){
        super(commentRepository);
    }
}
