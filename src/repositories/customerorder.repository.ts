import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {ViewCustomerOrder} from "../models/ViewCustomerOrder";

export class CustomerOrderRepository<T> extends BaseRepository<ViewCustomerOrder>{
    protected readonly repositoryManager : Repository<ViewCustomerOrder>;

    constructor(){
        super();
        this.repositoryManager = getRepository(ViewCustomerOrder);
    }
}
