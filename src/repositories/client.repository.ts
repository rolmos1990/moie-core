import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Client} from "../models/Client";

export class ClientRepository<T> extends BaseRepository<Client>{
    protected readonly repositoryManager : Repository<Client>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Client);
    }
}
