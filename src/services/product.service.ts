import {BaseService} from "../common/controllers/base.service";
import {ProductRepository} from "../repositories/product.repository";
import {Product} from "../models/Product";

export class ProductService extends BaseService<Product> {
    constructor(
        private readonly productRepository: ProductRepository<Product>
    ){
        super(productRepository);
    }
}
