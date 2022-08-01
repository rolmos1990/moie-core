import {BaseService} from "../common/controllers/base.service";
import {ProductSize} from "../models/ProductSize";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {ProductSizeRepository} from "../repositories/productSize.repository";
import {getRealInventary, getRealOrderDetail, isEmpty} from "../common/helper/helpers";
import {Product} from "../models/Product";
import {IProductSize} from "../common/interfaces/IProductSize";
import {OrderDetail} from "../models/OrderDetail";

export class ProductSizeService extends BaseService<ProductSize> {
    constructor(
        private readonly productSizeRepository: ProductSizeRepository<ProductSize>,
    ){
        super(productSizeRepository);
    }

    async findByIds(productSizes: number[]){
        return await this.productSizeRepository.createQueryBuilder('ps')
            .leftJoinAndSelect('ps.product', 'p')
            .whereInIds(productSizes)
            .getMany();
    }

    /**
     * Modificar inventario desde un pedido
     */
    public async updateProductSize(orderDetails: OrderDetail[], increase : boolean){
        await Promise.all(orderDetails.map(async item => {
            if(increase){
                await this.productSizeRepository.increment(ProductSize, {color: item.color, name: item.size, product: item.product}, 'quantity', Math.abs(item.quantity));
                await this.productSizeRepository.createQueryBuilder('d').connection.query('CALL `moie-lucy-v2`.`filterTodo`(' + item.product.id + ');');
            } else {
                await this.productSizeRepository.decrement(ProductSize, {color: item.color, name: item.size, product: item.product}, 'quantity', Math.abs(item.quantity));
                await this.productSizeRepository.createQueryBuilder('d').connection.query('CALL `moie-lucy-v2`.`filterTodo`(' + item.product.id + ');');
            }
        }));
    }



    /**
     * Modificar el inventario
     */
    public async changeProductSize(product: Product, sizesValues: Array<IProductSize>){
        const productSizes: ProductSize[] = await this.findByProduct(product.id);
        const toDelete = [];

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
                sizesValues.forEach(({name, color, qty, id}) => {
                    const existsId = productSizes.filter(item => item.id === id);
                    let exists = productSizes.filter(item => item.name === name && item.color === color);

                    if(existsId){
                        exists = existsId;
                    }

                    if(!isEmpty(exists)) {
                        //modificamos existente
                        productSizes.map(item => {
                            if(id && (item.id === id)){
                                item.name = name;
                                item.color = color;
                                item.quantity = qty;
                            }
                            else if (item.name === name && item.color === color) {
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

            //Verificar los eliminados
            if(productSizes.length > 0){
                productSizes.map(item => {
                    const hasOne = sizesValues.filter(newItem => item.id == newItem.id);
                    if(hasOne.length === 0){
                        toDelete.push(item);
                    }
                });
            }

            let itemSaved : ProductSize[];
            try {
                itemSaved = await this.createOrUpdate(productSizes);

                //force to delete
                if(toDelete.length > 0){
                    await Promise.all(toDelete.map(async item => {
                        await this.delete(item);
                    }));
                }
            }catch(e){
                throw new InvalidArgumentException("No se ha podido guardar el registro");
            }

            return itemSaved;
        }
        else if(!product.size){
            throw new InvalidArgumentException("Producto debe tener asignada una plantilla de tallas.");
        }
    }

    public async findByOrderDetail(orderDetail: OrderDetail) : Promise<ProductSize>{
        const productSize = await this.findByObject({
            name: orderDetail.size,
            color: orderDetail.color,
            product: orderDetail.product
        }, ['product']);
        return productSize[0];
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
            delete orderDetail.product.productImage;
            if(quantity < 0){
                await this.productSizeRepository.decrement(ProductSize, {color: orderDetail.color, name: orderDetail.size, product: orderDetail.product}, 'quantity', Math.abs(quantity));
                await this.productSizeRepository.createQueryBuilder('d').connection.query('CALL `moie-lucy-v2`.`filterTodo`(' + orderDetail.product.id + ');');

            } else if(quantity > 0){
                await this.productSizeRepository.increment(ProductSize, {color: orderDetail.color, name: orderDetail.size, product: orderDetail.product}, 'quantity', Math.abs(quantity));
                await this.productSizeRepository.createQueryBuilder('d').connection.query('CALL `moie-lucy-v2`.`filterTodo`(' + orderDetail.product.id + ');');
            }
        }catch(e){
            throw new ApplicationException("No se ha encontrado producto {"+orderDetail.product.reference+"} en el Inventario");
        }
    }

    public async checkInventary(_orderDetails: OrderDetail[], _oldDetails: OrderDetail[]){

        const productSizesToSearch = _orderDetails.map(item => item.productSize.id);
        let productSizes =  await this.findByIds(productSizesToSearch);

        let _orderDetailCopy = _orderDetails;

        //ingreso productos descontados en orden actual (si tengo orden previa realizada)
        if(_oldDetails.length > 0) {
            _orderDetailCopy = getRealOrderDetail(_orderDetails, _oldDetails);
        }

        //deducir cantidad (a comprobar)
        productSizes = getRealInventary(productSizes, _orderDetailCopy);

        const limits = productSizes.filter(item => item.quantity < 0)[0];

        if(limits){
            throw new InvalidArgumentException("No hay disponibilidad para producto "+limits.product.reference+"");
        }

        return true;

    }

    async getAvailables(products: number[]) : Promise<any>{
        const availables = await this.productSizeRepository.createQueryBuilder('ps')
            .select('p.id, SUM(ps.quantity) as quantity')
            .leftJoinAndSelect('ps.product', 'p')
            .where("p.id IN (:products)", {products: products})
            .groupBy("p.id")
            .getRawMany();

        if(availables.length === 0){
            return [];
        }
        return availables.map(_item => ({quantity: _item.quantity, id: _item.id}));
    }

}
