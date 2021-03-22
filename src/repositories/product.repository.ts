import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Product} from "../models/Product";

export class ProductRepository<T> extends BaseRepository<Product>{
    protected readonly repositoryManager : Repository<Product>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Product);
    }
}
