import {BaseService} from "../common/controllers/base.service";
import {ProductRepository} from "../repositories/product.repository";
import {Product} from "../models/Product";
import {SizeRepository} from "../repositories/size.repository";
import {Size} from "../models/Size";
import {InvalidArgumentException} from "../common/exceptions";

export class ProductService extends BaseService<Product> {
    constructor(
        private readonly productRepository: ProductRepository<Product>,
        private readonly sizeRepository: SizeRepository<Size>
    ){
        super(productRepository);
    }

    public async getReference(referenceKey: string){
        try {
            return this.productRepository.getNextReferenceCode(referenceKey);
        }catch(e){
            throw new InvalidArgumentException();
        }
    }
}
