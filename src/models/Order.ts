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
import {DeliveryMethod} from "./DeliveryMethod";
import {ProductImage} from "./ProductImage";
import {OrderDetail} from "./OrderDetail";
import {User} from "./User";

/**
 * El isImpress -> o Impreso seria un Estatus más,
 *
 */
@Entity({name: 'Order'})
export class Order extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Customer)
    @JoinColumn({name: 'customer_id'})
    customer: Customer;

    @ManyToOne(() => DeliveryMethod)
    @JoinColumn({name: 'delivery_method_id'})
    deliveryMethod: DeliveryMethod;

    @Column({name:'delivery_cost', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    deliveryCost: number;

    @Column({name:'charge_on_delivery', type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    chargeOnDelivery: boolean;

    @Column({name:'origen', type: 'varchar', length: 150, nullable: true})
    @Length(3, 150, {groups: ['create','update']})
    @IsOptional()
    origen: string;

    @Column({name:'total_amount', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    totalAmount: number;

    @Column({name:'sub_total', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    subTotalAmount: number;

    @Column({name:'total_discount', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    totalDiscount: number;

    @Column({name:'total_revenue', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    totalRevenue: number;

    @Column({name:'total_weight', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    totalWeight: number;

    @Column({name:'tracking', type: 'varchar', length: 200, nullable: true})
    @Length(0,200, {groups: ['create','update']})
    @IsOptional()
    tracking: string;

    @Column({name:'remember', type: 'boolean', nullable: true})
    @IsBoolean({groups: ['create','update']})
    remember: boolean;

    @Column({name:'paymentMode', type: 'integer', nullable: true})
    @IsNumber()
    @IsOptional()
    paymentMode: number;

    @Column({name:'pieces_for_changes', type: 'integer', nullable: true})
    @IsNumber()
    @IsOptional()
    piecesForChanges: number;

    @Column({name:'delivery_type', type: 'integer', nullable: true})
    @IsOptional()
    deliveryType : number;

    @CreateDateColumn({name:'expired_date', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    expiredDate: Date;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    updatedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({name:'status', type: 'integer'})
    @IsNumber()
    status: number;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
    orderDetails: OrderDetail[];

    isEmpty(): boolean {
        return (this.id == null);
    }

}
