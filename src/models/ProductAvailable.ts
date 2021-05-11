import {
    JoinColumn,
    ManyToOne,
    ViewColumn, ViewEntity
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Product} from "./Product";

@ViewEntity({
    name: 'ProductAvailableView',
    expression: `
        SELECT product_id,
               (Select SUM(quantity)
                from ProductSize
                where product_id = "OrderDetail".product_id
                group by ProductSize.product_id) as available,
               (Select SUM(OrderDetail.quantity) as Reserved
                from OrderDetail
                         inner join "Order" on OrderDetail.order_id = "Order".id
                where "Order".status = 1
                group by OrderDetail.product_id) as reserved,
               (Select SUM(OrderDetail.quantity)
                from OrderDetail
                         inner join "Order" on OrderDetail.order_id = "Order".id
                where "Order".status IN (4, 5)
                group by OrderDetail.product_id) as completed
        from OrderDetail
        group by OrderDetail.product_id;
    `
})

export class ProductAvailable extends BaseModel{

    @ManyToOne(() => Product, product => product.productAvailable)
    @JoinColumn({name:'product_id'})
    product: number;

    @ViewColumn({name:'available'})
    available: number;

    @ViewColumn({name:'reserved'})
    reserved: number;

    @ViewColumn({name:'completed'})
    completed: number;

    isEmpty(): boolean {
        return (this.product == null);
    }

}
