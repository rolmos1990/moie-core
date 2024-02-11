import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Items} from "../models/Items";

export class ItemsRepository<T> extends BaseRepository<Items>{
    protected readonly repositoryManager : Repository<Items>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Items);
    }
}
