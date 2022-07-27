import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {Size as SizeNew} from "../models/Size";

@Entity({database: OriginalDatabaseName, name: 'talla', orderBy: {id: 'ASC'}, synchronize: false})
export class SizeOriginal extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    /* remplaza descripción */
    @Column({name:'descripcion', type: 'varchar', length: 255})
    @Length(3, 100, {groups: ['create','update']})
    name: string;

    @Column({name:'tallas', type: 'varchar', length: 255})
    @Length(3, 100, {groups: ['create','update']})
    sizes: string;

    @OneToOne(() => Size)
    @JoinColumn({name: "id"})
    sizeNew: SizeNew;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
