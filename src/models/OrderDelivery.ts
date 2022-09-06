import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsOptional, Length} from "class-validator";
import {Order} from "./Order";
import {DeliveryLocality} from "./DeliveryLocality";
import {Type} from "class-transformer";

@Entity({name: 'OrderDelivery'})
export class OrderDelivery extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => Order, order => order.id)
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

    @Column({name:'delivery_status', type: 'varchar', length: 200, nullable: true})
    @Length(0,200, {groups: ['create','update']})
    @IsOptional()
    deliveryStatus: string;

    @Column({name:'delivery_current_locality', type: 'varchar', length: 200, nullable: true})
    @Length(0,200, {groups: ['create','update']})
    @IsOptional()
    deliveryCurrentLocality: string;

    @Column({name:'delivery_date', type: 'datetime', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    deliveryDate: Date;

    @Column({name:'delivery_status_date', type: 'datetime', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    deliveryStatusDate: Date;

    /** Se aplica cargo en la entrega */
    @Column({name:'charge_on_delivery', type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    chargeOnDelivery: boolean;

    /** Permite sincronizar con algun servicio de envios */
    @Column({name:'sync', type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    sync: boolean;

    /** Tipo de entrega */
    @Column({name:'delivery_type', type: 'integer', nullable: true})
    @IsOptional()
    deliveryType : number;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    updatedAt: Date;

    @Column({name:'sync_date', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    syncDate: Date;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
