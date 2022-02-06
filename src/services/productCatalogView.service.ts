import {BaseService} from "../common/controllers/base.service";
import {ProductCatalogViewRepository} from "../repositories/productCatalogView.repository";
import {ProductCatalogView} from "../models/ProductCatalogView";

export class ProductCatalogViewService extends BaseService<ProductCatalogView> {
    constructor(
        private readonly productCatalogViewRepository: ProductCatalogViewRepository<ProductCatalogView>
    ){
        super(productCatalogViewRepository);
    }
}
