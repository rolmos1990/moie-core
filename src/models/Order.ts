import {
    AfterUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn, UpdateEvent
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
import {OrderStatus} from "../common/enum/orderStatus";
import {DeliveryTypes} from "../common/enum/deliveryTypes";
import {Bill} from "./Bill";
import {Comment} from "./Comment";

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

    comments: Comment[];

    isEmpty(): boolean {
        return (this.id == null);
    }

    hasTracking() : boolean {
        return this.orderDelivery && this.orderDelivery.tracking !== null;
    }

    hasSomeStatus(_statusses: OrderStatus[]) : boolean {
        return _statusses.indexOf(this.status) ? true : false;
    }

    /** Status */
    isPending() : boolean {
        return this.status === OrderStatus.PENDING;
    }

    setPending() : void {
        this.status = OrderStatus.PENDING;
    }

    isConfirmed() : boolean {
        return this.status === OrderStatus.CONFIRMED;
    }

    isPrinted() : boolean {
        return this.status === OrderStatus.PRINTED;
    }

    isSent() : boolean {
        return this.status === OrderStatus.SENT;
    }

    isReconcilied() : boolean {
        return this.status === OrderStatus.RECONCILED;
    }

    isCanceled() : boolean {
        return this.status === OrderStatus.CANCELED;
    }

    isFinished() : boolean {
        return this.status === OrderStatus.FINISHED;
    }

    /** Identifica si es un valor correspondiente a cualquier previo pago */
    isPreviousPayment() : boolean {
        if(!this.orderDelivery){
            return false;
        }
        return ([DeliveryTypes.PAY_ONLY_DELIVERY, DeliveryTypes.PREVIOUS_PAYMENT].indexOf(this.orderDelivery.deliveryType)) !== -1;
    }

    /** Identifica si la orden puede ser cancelable */
    canBeCanceled() : boolean {
        if(this.isPreviousPayment() && this.isPending()){
            return true;
        }
        if(!this.isPreviousPayment() && [OrderStatus.PENDING,OrderStatus.CONFIRMED,OrderStatus.SENT,OrderStatus.PRINTED].includes(this.status)){
            return true;
        }

        return false;
    }

    @AfterUpdate()
    addHistoricRegister(event: UpdateEvent<any>) {
    }

    initialize(){
        this.orderDelivery = new OrderDelivery();
        this.orderDelivery.deliveryCost = 0;
        this.prints = 0;
        this.photos = 0;
        this.quantity = 0;
        this.totalWeight = 0;
        this.totalAmount = 0;
        this.subTotalAmount = 0;
        this.totalDiscount = 0;
        this.totalRevenue = 0;
        this.status = OrderStatus.PENDING;
    }


    hasDiffWith(o: Order) : boolean{

        if(o.isEmpty() || this.isEmpty()){
            return true;
        }

        if(
            o.totalAmount !== this.totalAmount ||
            o.paymentMode !== this.paymentMode ||
            o.payment !== this.payment ||
            o.user !== this.user ||
            o.piecesForChanges !== this.piecesForChanges ||
            o.customer !== this.customer ||
            o.quantity !== this.quantity ||
            o.totalWeight !== this.totalWeight ||
            o.deliveryMethod !== this.deliveryMethod ||
            o.orderDelivery.deliveryType !== this.orderDelivery.deliveryType ||
            o.orderDelivery.deliveryMunicipality !== this.orderDelivery.deliveryMunicipality ||
            o.orderDelivery.chargeOnDelivery !== this.orderDelivery.chargeOnDelivery
        ){
            return true;
        }

        return false;
    }

    compareHashDiff(hash: string){
        return this.orderDetails.map(item => item.toHash()).join("") !== hash;
    }

    getHashProducts(){
        return this.orderDetails.map(item => item.toHash()).join("");
    }
}
