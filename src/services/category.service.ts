import {BaseService} from "../common/controllers/base.service";
import {Category} from "../models/Category";
import {CategoryRepository} from "../repositories/category.repository";
import {Order} from "../models/Order";
import {TemplatesRegisters} from "../common/enum/templatesTypes";

export class CategoryService extends BaseService<Category> {
    constructor(
        private readonly categoryRepository: CategoryRepository<Category>
    ){
        super(categoryRepository);
    }
}
