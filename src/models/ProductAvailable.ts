import {
    JoinColumn,
    ManyToOne, OneToOne, PrimaryGeneratedColumn,
    ViewColumn, ViewEntity
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Product} from "./Product";

@ViewEntity({
    name: 'ProductAvailableView',
    expression: `
        SELECT id,
               (Select SUM(quantity)
                from ProductSize
                where product_id = \`Product\`.id
                group by ProductSize.product_id) as available,
               (Select SUM(OrderDetail.quantity) as Reserved
                from OrderDetail
                         inner join \`Order\` on OrderDetail.order_id = \`Order\`.id
                where \`Order\`.status = 1
                  and OrderDetail.product_id = Product.id
                group by OrderDetail.product_id) as reserved,
               (Select SUM(OrderDetail.quantity)
                from OrderDetail
                         inner join \`Order\` on OrderDetail.order_id = \`Order\`.id
                where \`Order\`.status IN (4, 5)
                  and OrderDetail.product_id = Product.id
                group by OrderDetail.product_id) as completed
        from Product;
    `
})

export class ProductAvailable extends BaseModel{

    @PrimaryGeneratedColumn()
    @OneToOne(() => Product, product => product.productAvailable)
    @JoinColumn({name:'id'})
    id: number;

    @ViewColumn({name:'available'})
    available: number;

    @ViewColumn({name:'reserved'})
    reserved: number;

    @ViewColumn({name:'completed'})
    completed: number;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
