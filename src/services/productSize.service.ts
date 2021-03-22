import {BaseService} from "../common/controllers/base.service";
import {ProductSize} from "../models/ProductSize";
import {InvalidArgumentException} from "../common/exceptions";
import {ProductSizeRepository} from "../repositories/productSize.repository";

export class ProductSizeService extends BaseService<ProductSize> {
    constructor(
        private readonly productSizeRepository: ProductSizeRepository<ProductSize>
    ){
        super(productSizeRepository);
    }

    public async findByProduct(id: number) : Promise<ProductSize[] | null>{
        if(!id){
            throw new InvalidArgumentException();
        }
        const productSizes = await this.productSizeRepository.findBy('product', id);
        return productSizes || [];
    }
}
