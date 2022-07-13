import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsNumber, IsOptional, Length,} from "class-validator";
import {Type} from "class-transformer";
import {Customer} from "./Customer";

/**
 * El isImpress -> o Impreso seria un Estatus más,
 *
 */
@Entity({name: 'Order'})
export class Order extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Customer)
    @JoinColumn({name: 'id_cliente'})
    customer: Customer;

    @Column({name:'metodo_envio', type: 'varchar', length: 200, nullable: true})
    deliveryMethod: string;

    @Column({name:'monto_envio', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    deliveryAmount: number;

    @Column({name:'origen', type: 'varchar', length: 150, nullable: true})
    @Length(3, 150, {groups: ['create','update']})
    @IsOptional()
    origen: string;

    @Column({name:'status', type: 'varchar', length: 300})
    status: string;

    @CreateDateColumn({name:'fecha_creacion'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @CreateDateColumn({name:'fecha_venta', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    dateOfSale: Date;

    @Column({name:'fecha_expiracion', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    expiredDate: Date;

    @Column({name:'recordatorio', type: 'boolean', nullable: true})
    @IsBoolean({groups: ['create','update']})
    remember: boolean;

    @Column({name:'rastreo', type: 'varchar', length: 350})
    trackingNumber: string;

    @Column({name:'impresiones', type: 'integer', default: 0})
    @IsNumber()
    prints: number;

    @Column({name:'tipo', type: 'varchar', length: 350})
    deliveryType: string;

    @Column({name:'confirmacion', type: 'varchar', length: 350})
    confirmation: string;

    @Column({name:'id_despacho', type: 'integer', nullable: true})
    office: number;

    @Column({name:'piezas_cambio', type: 'integer', nullable: true})
    piecesForChanges: number;

    @Column({name:'id_localidad', type: 'integer', nullable: true})
    deliveryLocality: number;

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

    @Column({name:'id_usuario', type: 'integer', nullable: true})
    user: number;


    isEmpty(): boolean {
        return (this.id == null);
    }
}
