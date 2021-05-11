import {BaseService} from "../common/controllers/base.service";
import {ProductSize} from "../models/ProductSize";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {ProductSizeRepository} from "../repositories/productSize.repository";
import {isEmpty} from "../common/helper/helpers";
import {Product} from "../models/Product";
import {IProductSize} from "../common/interfaces/IProductSize";
import {LIMIT_SAVE_BATCH} from "../common/persistence/mysql.persistence";
import {OrderDetail} from "../models/OrderDetail";

export class ProductSizeService extends BaseService<ProductSize> {
    constructor(
        private readonly productSizeRepository: ProductSizeRepository<ProductSize>
    ){
        super(productSizeRepository);
    }

    /**
     * Modificar el inventario
     */
    public async changeProductSize(product: Product, sizesValues: Array<IProductSize>){
        const productSizes: ProductSize[] = await this.findByProduct(product.id);

        if (!product.isEmpty() && product.size) {
            if (!productSizes.length) {
                //its empty
                sizesValues.forEach(item => {
                    let prodSize = new ProductSize();
                    prodSize.name = item.name;
                    prodSize.quantity = item.qty;
                    prodSize.color = item.color;
                    prodSize.product = product;
                    productSizes.push(prodSize);
                });
            } else {
                sizesValues.forEach(({name, color, qty}) => {
                    const exists = productSizes.filter(item => item.name === name && item.color === color);
                    if(!isEmpty(exists)) {
                        //modificamos existente
                        productSizes.map(item => {
                            if (item.name === name && item.color === color) {
                                item.color = color;
                                item.quantity = qty;
                            }
                        });
                    } else {
                        //creamos el nuevo identificador
                        const prodSize = new ProductSize();
                        prodSize.name = name;
                        prodSize.quantity = qty;
                        prodSize.color = color;
                        prodSize.product = product;
                        productSizes.push(prodSize);
                    }
                });
            }

            let itemSaved : ProductSize[];
            try {
                itemSaved = await this.createOrUpdate(productSizes, {chunk: LIMIT_SAVE_BATCH});
            }catch(e){
                throw new InvalidArgumentException("No se ha podido guardar el registro");
            }

            return itemSaved;
        }
        else if(!product.size){
            throw new InvalidArgumentException("Producto debe tener asignada una plantilla de tallas.");
        }
    }

    public async findByProduct(id: number, relations = []) : Promise<ProductSize[] | null>{
        if(!id){
            throw new InvalidArgumentException();
        }
        const productSizes = await this.productSizeRepository.findBy('product', id, relations);
        return productSizes || [];
    }

    /** Quantity - si quantity es positive se incrementa en el inventario, si es negative se resta */
    public async updateInventary(orderDetail: OrderDetail, quantity){
        try {
            if(quantity < 0){
                await this.productSizeRepository.decrement(ProductSize, {color: orderDetail.color, name: orderDetail.size, product: orderDetail.product}, 'quantity', Math.abs(quantity));
            } else {
                await this.productSizeRepository.increment(ProductSize, {color: orderDetail.color, name: orderDetail.size, product: orderDetail.product}, 'quantity', Math.abs(quantity));
            }
        }catch(e){
            throw new ApplicationException("No se ha encontrado producto {"+orderDetail.product.reference+"} en el Inventario");
        }
    }
}
