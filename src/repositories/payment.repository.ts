import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Payment} from "../models/Payment";

export class PaymentRepository<T> extends BaseRepository<Payment>{
    protected readonly repositoryManager : Repository<Payment>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Payment);
    }
}
