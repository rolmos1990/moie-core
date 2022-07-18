import {Column, Entity, PrimaryColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";

/**
 * Usuarios
 */
@Entity({database: OriginalDatabaseName, name: 'usuario', orderBy: {id: 'ASC'}, synchronize: false})
export class User extends BaseModel{

    @PrimaryColumn({name:'id', type: 'varchar', length: 20})
    id: string;

    @Column({name:'nombre', type: 'varchar', length: 255})
    @Length(1, 100, {groups: ['create','update']})
    name: string;

    @Column({name:'password', type: 'varchar', length: 255})
    @Length(1, 100, {groups: ['create','update']})
    password: string;

    @Column({name:'identificador', type: 'integer'})
    idNumeric: number;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
