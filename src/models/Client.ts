import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsEmail, Length, IsBoolean} from "class-validator";
import { Type } from 'class-transformer';
import {Municipality} from "./Municipality";
import {State} from "./State";
import {NewDatabaseName} from "../common/persistence";

@Entity({database: NewDatabaseName, name: 'Client', orderBy: {id: 'DESC'}})
export class Client extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 30})
    @Length(3, 30, {groups: ['create','update']})
    name: string;

    @Column({type: 'varchar', length: 300, nullable: true})
    @Length(0, 300, {groups: ['create','update']})
    @IsEmail()
    email: string | null;

    @Column({type: 'varchar', length: 30})
    @Length(3, 30, {groups: ['create','update']})
    phone: string;

    @Column({type: 'varchar', length: 45})
    @Length(3, 45, {groups: ['create','update']})
    celphone: string;

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    isMayorist: boolean;

    @Column({type: 'boolean'})
    @IsBoolean( {groups: ['create']})
    hasNotification: boolean;

    @ManyToOne(() => State)
    @JoinColumn({name:'state_id'})
    state: State;

    @ManyToOne(() => Municipality, { nullable: true })
    @JoinColumn({ name:'municipality_id' })
    municipality: Municipality | null;

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    equals(obj: any) {
        if(obj instanceof Client === false){
            return false;
        }
        if(obj.id === this.id){
            return true;
        }
        return false;
    }

    toString(){
        return Client.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
