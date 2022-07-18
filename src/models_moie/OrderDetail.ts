import {
    Column,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDecimal, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {Order} from "./Order";
import {ProductWithNew} from "./ProductWithNew";

@Entity({database: OriginalDatabaseName, name: 'venta_producto', orderBy: {id: 'ASC'}, synchronize: false})
export class OrderDetail extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order)
    @JoinColumn({name:'id_venta'})
    order: Order;

    @ManyToOne(() => ProductWithNew)
    @JoinColumn({name:'id_producto'})
    product: ProductWithNew;

    @Column({name:'color', type: 'varchar', length: 30})
    color: string;

    @Column({name:'talla', type: 'varchar', length: 10})
    size: string;

    @Column({name:'cantidad', type: 'integer'})
    quantity: number;

    @Column({name:'precio', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    price: number;

    @Column({name:'costo', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    cost: number;

    @Column({name:'ajuste', type: 'integer'})
    adjustment: number;

    isEmpty(){
        return (this.id == null);
    }
}
