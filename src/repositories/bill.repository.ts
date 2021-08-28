import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Bill} from "../models/Bill";

export class BillRepository<T> extends BaseRepository<Bill>{
    protected readonly repositoryManager : Repository<Bill>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Bill);
    }
}
