import {
    Column,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsOptional, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {Order} from "./Order";
import {Type} from "class-transformer";

@Entity({database: OriginalDatabaseName, name: 'postventa', orderBy: {id: 'ASC'}, synchronize: false})
export class OrderPostSale extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order)
    @JoinColumn({name:'id_venta'})
    order: Order;

    @Column({name:'id_payu', type: 'varchar', length: 100})
    payu: string;

    @Column({name:'activo', type: 'boolean'})
    sync: boolean;

    @Column({name:'rastreo', type: 'varchar', length: 200, nullable: true})
    @Length(0,200, {groups: ['create','update']})
    @IsOptional()
    tracking: string;

    @Column({name:'estatus_envio', type: 'varchar', length: 200, nullable: true})
    @Length(0,200, {groups: ['create','update']})
    @IsOptional()
    deliveryStatus: string;

    @Column({name:'ubicacion_estatus_envio', type: 'varchar', length: 200, nullable: true})
    @Length(0,200, {groups: ['create','update']})
    @IsOptional()
    deliveryCurrentLocality: string;

    @Column({name:'fecha_envio', type: 'datetime', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    deliveryDate: Date;

    @Column({name:'fecha_estatus_envio', type: 'datetime', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    deliveryStatusDate: Date;

    isEmpty(){
        return (this.id == null);
    }
}
