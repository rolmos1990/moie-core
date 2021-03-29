import {BaseService} from "../common/controllers/base.service";
import {Product} from "../models/Product";
import {ProductImageRepository} from "../repositories/productImage.repository";

export class ProductImageService extends BaseService<Product> {
    constructor(
        private readonly productRepository: ProductImageRepository<Product>
    ){
        super(productRepository);
    }
}
