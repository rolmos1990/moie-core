import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {OrderHistoric} from "../models/OrderHistoric";

export class OrderHistoricRepository<T> extends BaseRepository<OrderHistoric>{
    protected readonly repositoryManager : Repository<OrderHistoric>;

    constructor(){
        super();
        this.repositoryManager = getRepository(OrderHistoric);
    }
}
