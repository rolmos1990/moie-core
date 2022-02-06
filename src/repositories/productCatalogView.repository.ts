import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {ProductCatalogView} from "../models/ProductCatalogView";

export class ProductCatalogViewRepository<T> extends BaseRepository<ProductCatalogView>{
    protected readonly repositoryManager : Repository<ProductCatalogView>;

    constructor(){
        super();
        this.repositoryManager = getRepository(ProductCatalogView);
    }

}
