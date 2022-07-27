import {Column, Entity, JoinColumn, ManyToOne, MoreThan, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length, Min} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {ProductWithNew} from "./ProductWithNew";

/**
 * Existencia de Productos.
 */
@Entity({database: OriginalDatabaseName, name: 'existencia', orderBy: {id: 'ASC'}, synchronize: false})
export class ProductSizeOriginal extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => ProductWithNew)
    @JoinColumn({name:'id_producto'})
    product: ProductWithNew;

    @Column({name:'talla', type: 'varchar', length: 255})
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
