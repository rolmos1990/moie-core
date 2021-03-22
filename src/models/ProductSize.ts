import {Column, Entity, JoinColumn, ManyToOne, MoreThan, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Product} from "./Product";
import {Length, Min} from "class-validator";

//remplazaria a 'existencia'
@Entity({name: 'ProductSize', orderBy: {id: 'ASC'}})
export class ProductSize extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'name', type: 'varchar', length: 60})
    @Length(1, 100, {groups: ['create','update']})
    name: string;

    @Column({name:'color', type: 'varchar', length: 100})
    @Length(1, 100, {groups: ['create','update']})
    color: string;

    @Column({name:'quantity', type: 'integer'})
    @Min(0, {groups: ['create','update']})
    quantity: number;

    @ManyToOne(() => Product, product => product.productSize)
    @JoinColumn({name:'product_id'})
    product: Product;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
