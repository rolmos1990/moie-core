import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";

//Equivalente a (talla)
@Entity({name: 'Size', orderBy: {id: 'ASC'}})
export class Size extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    /* remplaza descripción */
    @Column({name:'name', type: 'varchar', length: 60})
    @Length(3, 100, {groups: ['create','update']})
    name: string;

    @Column("simple-array")
    sizes: string[];

    isEmpty(): boolean {
        return (this.id == null);
    }

}
