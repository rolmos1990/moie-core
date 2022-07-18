import {
    Column,
    Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";
import {Municipality} from "./Municipality";
import {OriginalDatabaseName} from "../common/persistence";
import {State as StateNew} from "../models/State";

@Entity({database: OriginalDatabaseName, name: 'estado', orderBy: {id: 'ASC'}, synchronize: false})
export class State extends BaseModel{
    @PrimaryColumn({name:'id', type: 'varchar', length: 300})
    id: string;

    @Column({name:'codigo_dian', type: 'varchar', length: 10})
    @Length(3, 10, {groups: ['create','update']})
    dianCode: string;

    @Column({name:'codigo_iso', type: 'varchar', length: 5})
    @Length(3, 5, {groups: ['create','update']})
    isoCode: string;

    @OneToMany(() => Municipality, municipality => municipality.state)
    municipalities: Municipality[];

    @OneToOne(() => StateNew)
    @JoinColumn({name: "id", referencedColumnName: "name"})
    stateNew: StateNew;

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
