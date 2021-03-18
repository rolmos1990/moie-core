import {
    Column,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDecimal, IsInt, Length} from "class-validator";
import {Municipality} from "./Municipality";

@Entity({name: 'State', orderBy: {id: 'ASC'}})
export class State extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'name', type: 'varchar', length: 100})
    @Length(3, 255, {groups: ['create','update']})
    name: string;

    @Column({name:'dian_code', type: 'varchar', length: 10})
    @Length(3, 10, {groups: ['create','update']})
    dianCode: string;

    @Column({name:'iso_code', type: 'varchar', length: 5})
    @Length(3, 5, {groups: ['create','update']})
    isoCode: string;

    @OneToMany(() => Municipality, municipality => municipality.state)
    municipalities: Municipality[];

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

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
