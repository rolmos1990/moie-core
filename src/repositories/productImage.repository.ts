import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {ProductImage} from "../models/ProductImage";

export class ProductImageRepository<T> extends BaseRepository<ProductImage>{
    protected readonly repositoryManager : Repository<ProductImage>;

    constructor(){
        super();
        this.repositoryManager = getRepository(ProductImage);
    }
}
