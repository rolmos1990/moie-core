import {Column, Entity, JoinColumn, ManyToOne, MoreThan, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Product} from "./Product";
import {Length, Min} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";

//remplazaria a 'existencia'
@Entity({database: OriginalDatabaseName, name: 'ProductSize', orderBy: {id: 'ASC'}})
export class ProductSize extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Product, product => product.productSize)
    @JoinColumn({name:'id_producto'})
    product: Product;

    @Column({name:'size', type: 'varchar', length: 255})
    @Length(1, 100, {groups: ['create','update']})
    name: string;

    @Column({name:'color', type: 'varchar', length: 100})
    @Length(1, 100, {groups: ['create','update']})
    color: string;

    @Column({name:'cantidad', type: 'integer'})
    @Min(0, {groups: ['create','update']})
    quantity: number;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
