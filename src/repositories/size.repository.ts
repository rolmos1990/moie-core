import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Size} from "../models/Size";

export class SizeRepository<T> extends BaseRepository<Size>{
    protected readonly repositoryManager : Repository<Size>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Size);
    }
}
