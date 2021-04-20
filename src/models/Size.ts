import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsNumber, Length} from "class-validator";

//Equivalente a (talla)
@Entity({name: 'Size', orderBy: {id: 'DESC'}})
export class Size extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    /* remplaza descripción */
    @Column({name:'name', type: 'varchar', length: 60})
    @Length(3, 100, {groups: ['create','update']})
    name: string;

    @Column({name:'reference_key', type: 'varchar', length: 4})
    @Length(1, 4, {groups: ['create','update']})
    referenceKey: string;

    @Column({name:'start_from', type: 'integer', nullable: true})
    @IsNumber()
    startFrom: number;

    @Column("simple-array")
    sizes: string[];

    isEmpty(): boolean {
        return (this.id == null);
    }

}
