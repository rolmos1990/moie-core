import {
    Column,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {
    IsDecimal,
    IsNumber,
} from "class-validator";
import {Order} from "./Order";
import {Product} from "./Product";

/**
 * El isImpress -> o Impreso seria un Estatus más,
 *
 */
@Entity({name: 'OrderDetail'})
export class OrderDetail extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order)
    @JoinColumn({name: 'order_id'})
    order: number;

    @Column({name:'product_id', type: 'integer'})
    @ManyToOne(() => Product)
    @JoinColumn({name: 'product_id'})
    product: number;

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

}
