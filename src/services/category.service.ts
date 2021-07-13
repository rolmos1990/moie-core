import {BaseService} from "../common/controllers/base.service";
import {Category} from "../models/Category";
import {CategoryRepository} from "../repositories/category.repository";
import {Order} from "../models/Order";

export class CategoryService extends BaseService<Category> {
    constructor(
        private readonly categoryRepository: CategoryRepository<Category>
    ){
        super(categoryRepository);
    }

    /**
     * Obtener plantilla de catalogos
     */
    getCatalogTemplate() {
        return `PRINT_CATALOG_LIST`;
    }

    /**
     * Obtener plantilla de catalogos con referencias
     */
    getCatalogReferencesTemplate() {
        return `PRINT_CATALOG_LIST_REFERENCES`;
    }
}
