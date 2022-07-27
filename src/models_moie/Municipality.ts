import {
    Column,
    Entity, JoinColumn, ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";
import {State} from "./State";
import {OriginalDatabaseName} from "../common/persistence";
import {Municipality as MunicipalityNew} from "../models/Municipality";

@Entity({database: OriginalDatabaseName, name: 'municipio', orderBy: {id: 'ASC'}, synchronize: false})
export class Municipality extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'nombre', type: 'varchar', length: 200})
    @Length(3, 200, {groups: ['create','update']})
    name: string;

    @Column({name:'codigo_dian', type: 'varchar', length: 10})
    @Length(3, 10, {groups: ['create','update']})
    dianCode: string;

    @ManyToOne(() => State, state => state.municipalities)
    @JoinColumn({name:'id_estado'})
    state: State;

    @OneToOne(() => MunicipalityNew)
    @JoinColumn({name: "id"})
    municipalityNew: MunicipalityNew;

    equals(obj: any) {
        if(obj instanceof Municipality === false){
            return false;
        }
        if(obj.id === this.id){
            return true;
        }
        return false;
    }

    toString(){
        return Municipality.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
