import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {ProductSize} from "../models/ProductSize";

export class ProductSizeRepository<T> extends BaseRepository<ProductSize>{
    protected readonly repositoryManager : Repository<ProductSize>;

    constructor(){
        super();
        this.repositoryManager = getRepository(ProductSize);
    }
}
