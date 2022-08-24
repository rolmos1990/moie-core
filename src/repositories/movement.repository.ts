import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Movement} from "../models/Movement";

export class MovementRepository<T> extends BaseRepository<Movement>{
    protected readonly repositoryManager : Repository<Movement>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Movement);
    }
}
