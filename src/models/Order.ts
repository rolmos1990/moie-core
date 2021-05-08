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
import {Customer} from "./Customer";

/**
 * El isImpress -> o Impreso seria un Estatus más,
 *
 */
@Entity({name: 'Order', orderBy: {id: 'ASC'}})
export class Order extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Customer)
    @JoinColumn({name: 'customer_id'})
    customer: Customer;

    @Column({name:'delivery_method_id', type: 'varchar', length: 255})
    @Length(3, 255, {groups: ['create','update']})
    deliveryMethod: string;

    @Column({name:'delivery_cost', type: 'varchar', length: 800, nullable: true})
    @MaxLength(800, {groups: ['create','update']})
    deliveryCost: string;

    @Column({name:'charge_on_delivery', type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    chargeOnDelivery: boolean;

    @Column({name:'origen', type: 'varchar', length: 150})
    @Length(3, 150, {groups: ['create','update']})
    origen: string;

    @Column({name:'total_amount', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    totalAmount: number;

    @Column({name:'total_discount', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    totalDiscount: number;

    @Column({name:'total_revenue', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    totalRevenue: number;

    @Column({name:'total_weight', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    totalWeight: number;

    @Column({name:'tracking', type: 'varchar', length: 200})
    @Length(0,200, {groups: ['create','update']})
    tracking: string;

    @Column({name:'remember', type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    remember: boolean;

    @Column({name:'delivery_type', type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    deliveryType : boolean;

    @CreateDateColumn({name:'expired_date'})
    @Type(() => Date)
    @IsDate()
    expiredDate: Date;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    @Column({name:'status', type: 'integer'})
    @IsNumber()
    status: number;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
