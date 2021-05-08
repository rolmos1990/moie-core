import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Order} from "../models/Order";

export class OrderRepository<T> extends BaseRepository<Order>{
    protected readonly repositoryManager : Repository<Order>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Order);
    }
}
