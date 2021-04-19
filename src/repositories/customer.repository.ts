import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Customer} from "../models/Customer";

export class CustomerRepository<T> extends BaseRepository<Customer>{
    protected readonly repositoryManager : Repository<Customer>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Customer);
    }
}
