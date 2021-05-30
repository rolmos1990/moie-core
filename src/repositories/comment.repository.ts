import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Comment} from "../models/Comment";

export class CommentRepository<T> extends BaseRepository<Comment>{
    protected readonly repositoryManager : Repository<Comment>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Comment);
    }
}
