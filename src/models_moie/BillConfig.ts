import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsInt, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";

@Entity({database: OriginalDatabaseName, name: 'resolucion_fe', orderBy: {id: 'ASC'}, synchronize: false})
export class BillConfig extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'numero', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    number: string;

    @Column({name:'inicio', type: 'bigint'})
    @IsInt({groups: ['create','update']})
    startNumber: number;

    @Column({name:'fin', type: 'bigint'})
    @IsInt({groups: ['create','update']})
    finalNumber: number;

    @Column({name:'prefijo', type: 'varchar', length: 5})
    @Length(1, 5, {groups: ['create','update']})
    prefix: string;

    @Column({name:'fecha', type: 'varchar', length: 100, unique: true})
    @Length(3, 50, {groups: ['create','update']})
    resolutionDate: string;

    @Column({name:'activa', type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    isEmpty(){
        return (this.id == null);
    }
}
