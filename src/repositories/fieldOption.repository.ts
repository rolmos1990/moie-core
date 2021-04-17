import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Size} from "../models/Size";
import {FieldOption} from "../models/FieldOption";

export class FieldOptionRepository<T> extends BaseRepository<FieldOption>{
    protected readonly repositoryManager : Repository<FieldOption>;

    constructor(){
        super();
        this.repositoryManager = getRepository(FieldOption);
    }
}
