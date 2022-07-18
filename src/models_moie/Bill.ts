import {
    Column, CreateDateColumn,
    Entity, JoinColumn, ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsInt, IsString, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {Order} from "./Order";
import {Type} from "class-transformer";
import {BillConfig} from "./BillConfig";

@Entity({database: OriginalDatabaseName, name: 'factura', orderBy: {id: 'ASC'}, synchronize: false})
export class Bill extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => Order, order => order.id)
    @JoinColumn({name: 'id_venta'})
    order: Order;

    @CreateDateColumn({name:'fecha'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @Column({name:'iva', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    tax: number;

    @Column({name:'num_legal', type: 'bigint'})
    @IsInt({groups: ['create','update']})
    legalNumber: number;

    @ManyToOne(() => BillConfig)
    @JoinColumn({name: 'id_resolucion_fe'})
    billConfig: BillConfig;

    @Column({name:'enviada', type: 'varchar', length: 100})
    @IsBoolean({groups: ['create','update']})
    status: string;

    //Error DIAN, enviada, '' (blanco - pendiente)
    @Column({name:'track_id', type: 'varchar', length: 100})
    @IsBoolean({groups: ['create','update']})
    trackId: string;

    isEmpty(){
        return (this.id == null);
    }
}
