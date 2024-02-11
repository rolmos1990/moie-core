import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {VCard} from "../models/VCard";

export class VCardRepository<T> extends BaseRepository<VCard>{
    protected readonly repositoryManager : Repository<VCard>;

    constructor(){
        super();
        this.repositoryManager = getRepository(VCard);
    }
}
