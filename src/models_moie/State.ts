import {
    Column,
    Entity, OneToMany, PrimaryColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDecimal, IsInt, Length} from "class-validator";
import {Municipality} from "./Municipality";
import {OriginalDatabaseName} from "../common/persistence";

@Entity({database: OriginalDatabaseName, name: 'State', orderBy: {id: 'ASC'}})
export class State extends BaseModel{
    @PrimaryColumn({name:'id', type: 'varchar', length: 255})
    @Length(3, 255, {groups: ['create','update']})
    id: string;

    @Column({name:'dian_code', type: 'varchar', length: 10})
    @Length(3, 10, {groups: ['create','update']})
    dianCode: string;

    @Column({name:'codigo_iso', type: 'varchar', length: 5})
    @Length(3, 5, {groups: ['create','update']})
    isoCode: string;

    @OneToMany(() => Municipality, municipality => municipality.state)
    municipalities: Municipality[];

    equals(obj: any) {
        if(obj instanceof State === false){
            return false;
        }
        if(obj.id === this.id){
            return true;
        }
        return false;
    }

    toString(){
        return State.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
