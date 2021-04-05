import {BaseService} from "../common/controllers/base.service";
import {ProductSize} from "../models/ProductSize";
import {InvalidArgumentException} from "../common/exceptions";
import {ProductSizeRepository} from "../repositories/productSize.repository";
import {isEmpty} from "../common/helper/helpers";
import {Product} from "../models/Product";
import {IProductSize} from "../common/interfaces/IProductSize";
import {LIMIT_SAVE_BATCH} from "../common/persistence/mysql.persistence";

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
}
