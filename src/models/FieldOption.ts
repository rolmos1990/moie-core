import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";

/* replaza opcion */
/* Tags para diferentes objetos, puede ser usado como un atributo adicional */
@Entity({name: 'FieldOption', orderBy: {id: 'ASC'}})
export class FieldOption extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'group', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    group: string;

    @Column({name:'name', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    name: string;

    @Column({name:'value', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    value: string;

    isEmpty(): boolean {
        return false;
    }

}
