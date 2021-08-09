import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Office} from "../models/Office";

export class OfficeRepository<T> extends BaseRepository<Office>{
    protected readonly repositoryManager : Repository<Office>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Office);
    }
}
