import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {BatchRequest} from "../models/BatchRequest";

export class BatchRequestRepository<T> extends BaseRepository<BatchRequest>{
    protected readonly repositoryManager : Repository<BatchRequest>;

    constructor(){
        super();
        this.repositoryManager = getRepository(BatchRequest);
    }
}
