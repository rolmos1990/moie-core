import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {BillConfig} from "../models/BillConfig";

export class BillConfigRepository<T> extends BaseRepository<BillConfig>{
    protected readonly repositoryManager : Repository<BillConfig>;

    constructor(){
        super();
        this.repositoryManager = getRepository(BillConfig);
    }
}
