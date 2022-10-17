import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Cached} from "../models/Cached";

export class CachedRepository<T> extends BaseRepository<Cached>{
    protected readonly repositoryManager : Repository<Cached>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Cached);
    }
}
