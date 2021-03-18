import BaseRepository from "../common/repositories/base.repository";
import {User} from "../models/User";
import {DeliveryLocality} from "../models/DeliveryLocality";
import {getRepository, Repository} from "typeorm";

export class DeliveryLocalityRepository<T> extends BaseRepository<DeliveryLocality>{
    protected readonly repositoryManager : Repository<DeliveryLocality>;

    constructor(){
        super();
        this.repositoryManager = getRepository(DeliveryLocality);
    }
}
