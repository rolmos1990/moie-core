import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany, OneToOne, PrimaryColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsNumber, IsOptional, Length,} from "class-validator";
import {Type} from "class-transformer";
import {Customer} from "./Customer";
import {Payment} from "./Payment";
import {User} from "./User";
import {Office} from "./Office";
import {OriginalDatabaseName} from "../common/persistence";
import {Order as OrderNew} from "../models/Order";
import {OrderPostSale} from "./OrderPostSale";
import {OrderDetail} from "./OrderDetail";

/**
 * El isImpress -> o Impreso seria un Estatus más,
 *
 */
@Entity({database: OriginalDatabaseName, name: 'venta', orderBy: {id: 'ASC'}, synchronize: false})
export class Order extends BaseModel{

    @PrimaryColumn({name:'id', type: 'integer'})
    id: number;

    @OneToOne(() => OrderNew)
    @JoinColumn({name: "id", referencedColumnName: "id"})
    orderNew: OrderNew;

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

    @Column({name:'estatus', type: 'varchar', length: 300})
    status: string;

    @CreateDateColumn({name:'fecha_creacion'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @Column({name:'fecha_venta', nullable: true})
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

    @Column({name:'piezas_cambio', type: 'integer', nullable: true})
    piecesForChanges: number;

    @Column({name:'id_localidad', type: 'integer', nullable: true})
    deliveryLocality: number;

    @Column({name:'forma_pago', type: 'varchar', length: 350})
    @IsOptional()
    paymentMode: string;

    @ManyToOne(() => Office)
    @JoinColumn({name: 'id_despacho'})
    office: Office;

    @ManyToOne(() => User)
    @JoinColumn({name: 'id_usuario'})
    user: User;

    @OneToMany(() => OrderPostSale, (postSale) => postSale.order)
    postSale: OrderPostSale[]

    @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
    orderDetail: OrderDetail[]

    isEmpty(): boolean {
        return (this.id == null);
    }
}
