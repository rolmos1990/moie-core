import {Comment} from "../../models/Comment";
import {UserShortDTO} from "./user";


export const CommentListDTO = (comment: Comment) => ({
    id: comment.id,
    entity: comment.entity,
    idRelated: comment.idRelated,
    comment: comment.comment,
    user: UserShortDTO(comment.user),
    createdAt:comment.createdAt
});
