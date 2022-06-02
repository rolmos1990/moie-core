import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {ProductAvailable} from "../models/ProductAvailable";

export class ProductAvailableViewRepository<T> extends BaseRepository<ProductAvailable>{
    protected readonly repositoryManager : Repository<ProductAvailable>;

    constructor(){
        super();
        this.repositoryManager = getRepository(ProductAvailable);
    }

}
