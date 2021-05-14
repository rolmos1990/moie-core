import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsOptional, Length} from "class-validator";
import {Order} from "./Order";
import {DeliveryLocality} from "./DeliveryLocality";
import {Type} from "class-transformer";

@Entity({name: 'OrderDelivery'})
export class OrderDelivery extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order)
    @JoinColumn({name: 'order_id'})
    order: Order;

    @Column({name:'delivery_cost', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    deliveryCost: number;

    @ManyToOne(() => DeliveryLocality)
    @JoinColumn({name: 'deliveryLocality_id'})
    deliveryLocality: DeliveryLocality;

    /** Estado y municipio para dirección de orden */
    @Column({name:'deliveryState', type: 'varchar', length: 200, nullable: true})
    @Length(0,200, {groups: ['create','update']})
    @IsOptional()
    deliveryState: string;

    @Column({name:'deliveryMunicipality', type: 'varchar', length: 200, nullable: true})
    @Length(0,200, {groups: ['create','update']})
    @IsOptional()
    deliveryMunicipality: string;

    @Column({name:'tracking', type: 'varchar', length: 200, nullable: true})
    @Length(0,200, {groups: ['create','update']})
    @IsOptional()
    tracking: string;

    @Column({name:'delivery_date', type: 'datetime', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    deliveryDate: Date;

    /** Se aplica cargo en la entrega */
    @Column({name:'charge_on_delivery', type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    chargeOnDelivery: boolean;

    /** Tipo de entrega */
    @Column({name:'delivery_type', type: 'integer', nullable: true})
    @IsOptional()
    deliveryType : number;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
