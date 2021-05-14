import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {OrderDelivery} from "../models/OrderDelivery";

export class OrderDeliveryRepository<T> extends BaseRepository<OrderDelivery>{
    protected readonly repositoryManager : Repository<OrderDelivery>;

    constructor(){
        super();
        this.repositoryManager = getRepository(OrderDelivery);
    }
}
