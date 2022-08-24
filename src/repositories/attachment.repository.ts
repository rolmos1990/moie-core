import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Attachment} from "../models/Attachment";

export class AttachmentRepository<T> extends BaseRepository<Attachment>{
    protected readonly repositoryManager : Repository<Attachment>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Attachment);
    }
}
