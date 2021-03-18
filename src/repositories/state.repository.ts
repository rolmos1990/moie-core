import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {State} from "../models/State";

export class StateRepository<T> extends BaseRepository<State>{
    protected readonly repositoryManager : Repository<State>;

    constructor(){
        super();
        this.repositoryManager = getRepository(State);
    }
}
