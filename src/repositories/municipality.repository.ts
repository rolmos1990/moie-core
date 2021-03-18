import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Municipality} from "../models/Municipality";

export class MunicipalityRepository<T> extends BaseRepository<Municipality>{
    protected readonly repositoryManager : Repository<Municipality>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Municipality);
    }
}
