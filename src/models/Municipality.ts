import {
    Column,
    Entity, JoinColumn, ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDecimal, IsInt, Length} from "class-validator";
import {State} from "./State";
import {NewDatabaseName} from "../common/persistence";

@Entity({database: NewDatabaseName, name: 'Municipality', orderBy: {id: 'ASC'}})
export class Municipality extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 200})
    @Length(3, 200, {groups: ['create','update']})
    name: string;

    @Column({name:'dian_code', type: 'varchar', length: 10})
    @Length(3, 10, {groups: ['create','update']})
    dianCode: string;

    @ManyToOne(() => State, state => state.municipalities)
    @JoinColumn({name:'state_id'})
    state: State;

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

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
