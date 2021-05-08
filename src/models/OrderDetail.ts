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

    @Column({name:'product', type: 'varchar', length: 255})
    @Length(3, 255, {groups: ['create','update']})
    product: string;

    @Column({name:'color', type: 'varchar', length: 800, nullable: true})
    @MaxLength(800, {groups: ['create','update']})
    color: string;

    @Column({name:'size', type: 'numeric'})
    @IsBoolean({groups: ['create','update']})
    size: number;

    @Column({name:'origen', type: 'varchar', length: 150})
    @Length(3, 150, {groups: ['create','update']})
    quantity: string;

    @Column({name:'price', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    price: number;

    @Column({name:'cost', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    cost: number;

    @Column({name:'revenue', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    revenue: number;

    @Column({name:'discountPercent', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    discountPercent: number;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
