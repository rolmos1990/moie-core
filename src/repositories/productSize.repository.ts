import BaseRepository from "../common/repositories/base.repository";
import {EntityTarget, getRepository, Repository} from "typeorm";
import {ProductSize} from "../models/ProductSize";
import {Product} from "../models/Product";
import {OrderDetail} from "../models/OrderDetail";

export class ProductSizeRepository<T> extends BaseRepository<ProductSize>{
    protected readonly repositoryManager : Repository<ProductSize>;

    constructor(){
        super();
        this.repositoryManager = getRepository(ProductSize);
    }


    /**

     SELECT MAX(ProductSize.quantity) as quantity, SUM(OrderDetail.quantity) as used, MAX(ProductSize.quantity) + SUM(OrderDetail.quantity) as realQuantity, MAX(ProductSize.quantity) + SUM(OrderDetail.quantity) - 5 as available, ProductSize.product_id, ProductSize.name as name, ProductSize.color as color from ProductSize
     left join OrderDetail on OrderDetail.product_id = ProductSize.product_id and OrderDetail.size = ProductSize.name and OrderDetail.color = ProductSize.color
     where OrderDetail.order_id = 156
     group by ProductSize.product_id, ProductSize.name, ProductSize.color

     */
    //Esta funcion entrega lo requerido es que seria obtener el comparativo de lo que tengo disponible para saber si es valido o no la orden
    //Posteriormente solo actualizo lo que indique el detalle del pedido remplazando lo que ya tengo en la orden por esto nuevo indicado
    //De esta forma aseguro que eso se encuentre actualizado en todo momento.

    checkAvailableOrder(orderId){
        if(!orderId){

        } else {
            const available = this.repositoryManager.createQueryBuilder('ps')
                .select(['MAX(ps.quantity) as quantity',
                    'SUM(OrderDetail.quantity) as used',
                    'MAX(ProductSize.quantity) + SUM(OrderDetail.quantity) as realQuantity'])
                .leftJoinAndSelect('ps.OrderDetail', 'od',
                    'od.product_id = ps.product_id and od.size = ps.name and od.color = ps.color')
                .where('od.order_id = :orderId')
                .addGroupBy('ps.product_id')
                .addGroupBy('ps.name')
                .addGroupBy('ps.color')
                .setParameters({'orderId' : orderId});
            return available.getRawMany();
        }
    }

    checkAvailableForOrder(orderId){

        const available = this.repositoryManager.createQueryBuilder('ps')
            .select(['MAX(ps.quantity) as quantity',
                'SUM(OrderDetail.quantity) as used',
                'MAX(ProductSize.quantity) + SUM(OrderDetail.quantity) as realQuantity'])
            .leftJoinAndSelect('ps.OrderDetail', 'od',
                'od.product_id = ps.product_id and od.size = ps.name and od.color = ps.color')
            .where('od.order_id = :orderId')
            .addGroupBy('ps.product_id')
            .addGroupBy('ps.name')
            .addGroupBy('ps.color')
            .setParameters({'orderId' : orderId});

        return available.getRawMany();
       /* await this.repositoryManager.query("SELECT MAX(ProductSize.quantity) as quantity, " +
            "SUM(OrderDetail.quantity) as used, " +
            "MAX(ProductSize.quantity) + SUM(OrderDetail.quantity) as realQuantity, " +
            "MAX(ProductSize.quantity) + SUM(OrderDetail.quantity) - 5 as available, " +
            "ProductSize.product_id, " +
            "ProductSize.name as name, " +
            "ProductSize.color as color from ProductSize" +
            "left join OrderDetail on OrderDetail.product_id = ProductSize.product_id " +
            "and OrderDetail.size = ProductSize.name " +
            "and OrderDetail.color = ProductSize.color" +
            `where OrderDetail.order_id = ${orderId}` +
            "group by ProductSize.product_id, ProductSize.name, ProductSize.color");*/
    }
}
