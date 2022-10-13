import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Category} from "../models/Category";

export class CategoryRepository<T> extends BaseRepository<Category>{
    protected readonly repositoryManager : Repository<Category>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Category);
    }

    async resetOrderCategory(categoryId){
        await this.repositoryManager.manager.query('INSERT INTO ORDER_PRODUCTS (`KEY`,`PRODUCT_ID`) SELECT null, id FROM product where category_id = '+categoryId+' order by orden');
        await this.repositoryManager.manager.query('UPDATE product INNER JOIN ORDER_PRODUCTS AS P on PRODUCT_ID = id SET orden = P.KEY where category_id = '+categoryId);
        await this.repositoryManager.manager.query('DELETE FROM ORDER_PRODUCTS');
        await this.repositoryManager.manager.query('TRUNCATE ORDER_PRODUCTS');
    }
}
