import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Category} from "../models/Category";

export class CategoryRepository<T> extends BaseRepository<Category>{
    protected readonly repositoryManager : Repository<Category>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Category);
    }
}
