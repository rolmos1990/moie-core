import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsNumber, IsOptional, Length,} from "class-validator";
import {Type} from "class-transformer";
import {Customer} from "./Customer";
import {DeliveryMethod} from "./DeliveryMethod";
import {OrderDetail} from "./OrderDetail";
import {User} from "./User";
import {OrderDelivery} from "./OrderDelivery";
import {Office} from "./Office";
import {Payment} from "./Payment";
import {Bill} from "./Bill";

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

    @Column({name:'origen', type: 'varchar', length: 150, nullable: true})
    @Length(3, 150, {groups: ['create','update']})
    @IsOptional()
    origen: string;

    @Column({name:'total_amount', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    totalAmount: number;

    @Column({name:'total_with_discount', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    totalWithDiscount: number;

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

    @Column({name:'quantity', type: 'integer'})
    @IsNumber()
    quantity: number;

    @Column({name:'expired_date', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    expiredDate: Date;

    @CreateDateColumn({name:'date_of_sale', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    dateOfSale: Date;

    //Inicialmente serie la fecha de actualizacion
    @Column({name:'modified_date', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    modifiedDate: Date;

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

    @ManyToOne(() => Office, { nullable: true })
    @JoinColumn({name: 'office_id'})
    office: Office;

    @Column({name:'status', type: 'integer'})
    @IsNumber()
    status: number;

    @Column({name:'prints', type: 'integer', default: 0})
    @IsNumber()
    prints: number;

    @Column({name:'photos', type: 'integer', default: 0})
    @IsNumber()
    photos: number;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
    orderDetails: OrderDetail[];

    @OneToOne(() => OrderDelivery, orderDelivery => orderDelivery.order)
    @JoinColumn({name: 'order_delivery_id'})
    orderDelivery: OrderDelivery;

    @OneToOne(() => Payment, payment => payment.order)
    @JoinColumn({name: 'payment_id'})
    payment: Payment;

    @OneToOne(() => Bill, bill => bill.order)
    bill: Bill;

    isEmpty(): boolean {
        return (this.id == null);
    }
}
