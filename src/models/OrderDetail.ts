import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {
    isBoolean,
    IsBoolean,
    IsDate,
    IsDecimal,
    isNumber,
    IsNumber,
    IsOptional,
    Length,
    MaxLength
} from "class-validator";
import {Type} from "class-transformer";
import {ProductSize} from "./ProductSize";
import {Size} from "./Size";
import {Category} from "./Category";
import {ProductImage} from "./ProductImage";
import {Customer} from "./Customer";
import {Order} from "./Order";
import {Product} from "./Product";

/**
 * El isImpress -> o Impreso seria un Estatus más,
 *
 */
@Entity({name: 'OrderDetail', orderBy: {id: 'ASC'}})
export class OrderDetail extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order)
    @JoinColumn({name: 'order_id'})
    order: Order;

    @ManyToOne(() => Product)
    @JoinColumn({name: 'product_id'})
    product: Product;

    @Column({name:'color', type: 'varchar', length: 800, nullable: true})
    color: string;

    @Column({name:'size', type: 'varchar', length: 100})
    size: string;

    @Column({name:'quantity', type: 'integer'})
    @IsNumber({}, {groups: ['create','update']})
    quantity: number;

    @Column({name:'price', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    price: number;

    @Column({name:'cost', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    cost: number;

    @Column({name:'revenue', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    revenue: number;

    @Column({name:'weight', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    weight: number;

    @Column({name:'discountPercent', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    discountPercent: number;

    isEmpty(): boolean {
        return (this.id == null);
    }

    equals(orderDetail: OrderDetail): boolean {
        if(this.product.reference === orderDetail.product.reference &&
           this.size === orderDetail.size &&
           this.color === orderDetail.color){
            return true;
        }
        return false;
    }

}
