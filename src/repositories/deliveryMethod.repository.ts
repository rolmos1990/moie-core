import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {DeliveryMethod} from "../models/DeliveryMethod";

export class DeliveryMethodRepository<T> extends BaseRepository<DeliveryMethod>{
    protected readonly repositoryManager : Repository<DeliveryMethod>;

    constructor(){
        super();
        this.repositoryManager = getRepository(DeliveryMethod);
    }
}
