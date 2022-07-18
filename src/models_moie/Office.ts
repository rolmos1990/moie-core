import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsDecimal, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {Type} from "class-transformer";

/**
 * Existencia de Productos.
 */
@Entity({database: OriginalDatabaseName, name: 'despacho', orderBy: {id: 'ASC'}, synchronize: false})
export class Office extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'tipo', type: 'varchar', length: 255})
    @Length(1, 100, {groups: ['create','update']})
    type: string;

    @Column({name:'metodo', type: 'varchar', length: 255})
    @Length(1, 100, {groups: ['create','update']})
    method: string;

    @Column({name:'descripcion', type: 'varchar', length: 255})
    @Length(1, 100, {groups: ['create','update']})
    description: string;

    @Column({name:'estatus', type: 'varchar', length: 255})
    @Length(1, 100, {groups: ['create','update']})
    status: string;

    @CreateDateColumn({name:'fecha'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
