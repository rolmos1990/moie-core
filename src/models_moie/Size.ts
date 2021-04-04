import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";

@Entity({database: OriginalDatabaseName, name: 'talla', orderBy: {id: 'ASC'}})
export class Size extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    /* remplaza descripción */
    @Column({name:'descripcion', type: 'varchar', length: 255})
    @Length(3, 100, {groups: ['create','update']})
    name: string;

    @Column({name:'tallas', type: 'varchar', length: 255})
    @Length(3, 100, {groups: ['create','update']})
    sizes: string;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
