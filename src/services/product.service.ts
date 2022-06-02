import {BaseService} from "../common/controllers/base.service";
import {ProductRepository} from "../repositories/product.repository";
import {Product} from "../models/Product";
import {InvalidArgumentException} from "../common/exceptions";
import {ProductAvailableViewRepository} from "../repositories/productAvailableView.repository";
import {ProductAvailable} from "../models/ProductAvailable";

export class ProductService extends BaseService<Product> {
    constructor(
        private readonly productRepository: ProductRepository<Product>,
        private readonly productAvailableViewRepository: ProductAvailableViewRepository<ProductAvailable>
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

    public async getDashboardStat(){
        const products = await this.productAvailableViewRepository.createQueryBuilder('pav')
            .select('COUNT(id) as qty, SUM(available) as available, SUM(reserved) as reserved, SUM(completed) as completed')
            .getRawOne();

        return {
            qty: products['qty'],
            available: products['available'],
            reserved: products['reserved'],
            completed: products['completed']};
    }
}

