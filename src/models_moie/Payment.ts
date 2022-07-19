import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDecimal, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {Type} from "class-transformer";
import {Order} from "../models_moie/Order";

/**
 * Existencia de Productos.
 */
@Entity({database: OriginalDatabaseName, name: 'pago', orderBy: {id: 'ASC'}})
export class Payment extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order)
    @JoinColumn({name:'id_venta'})
    order: Order;

    @Column({name:'nombre', type: 'varchar', length: 255})
    @Length(1, 100, {groups: ['create','update']})
    name: string;

    @Column({name:'telefono', type: 'varchar', length: 255})
    @Length(1, 200, {groups: ['create','update']})
    phone: string;

    @Column({name:'forma', type: 'varchar', length: 255})
    @Length(1, 200, {groups: ['create','update']})
    type: string;

    @Column({name:'banco', type: 'varchar', length: 255})
    @Length(1, 200, {groups: ['create','update']})
    bank: string;

    @Column({name:'numero', type: 'varchar', length: 255})
    @Length(1, 200, {groups: ['create','update']})
    reference: string;

    @Column({name:'email', type: 'varchar', length: 400})
    @Length(1, 400, {groups: ['create','update']})
    email: string;

    @Column({name:'origen', type: 'varchar', length: 255})
    @Length(1, 200, {groups: ['create','update']})
    origen: string;

    @Column({name:'monto', type: 'varchar', length: 255})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    amount: string;

    @Column({name:'fechahora', nullable: true})
    @Type(() => Date)
    createdAt: Date;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
