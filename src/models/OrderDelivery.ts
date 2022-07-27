import {Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsOptional, Length} from "class-validator";
import {Type} from "class-transformer";
import {NewDatabaseName} from "../common/persistence";

@Entity({database: NewDatabaseName, name: 'OrderDelivery'})
export class OrderDelivery extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'order_id', type: 'integer', nullable: true})
    order: number;

    @Column({name:'delivery_cost', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    deliveryCost: number;

    @Column({name:'deliveryLocality_id', type: 'integer', nullable: true})
    deliveryLocality: number;

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

    isEmpty(): boolean {
        return (this.id == null);
    }

}
