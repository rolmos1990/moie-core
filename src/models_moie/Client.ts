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
import {OriginalDatabaseName} from "../common/persistence";

@Entity({database: OriginalDatabaseName, name: 'cliente', orderBy: {id: 'DESC'}})
export class Client extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name: 'nombre', type: 'varchar', length: 40})
    @Length(3, 40, {groups: ['create','update']})
    name: string;

    @Column({name:'email', type: 'varchar', length: 300, nullable: true})
    @Length(0, 300, {groups: ['create','update']})
    @IsEmail()
    email: string | null;

    @Column({name:'telefono_habitacion', type: 'varchar', length: 30})
    @Length(3, 30, {groups: ['create','update']})
    phone: string;

    @Column({name:'telefono_movil', type: 'varchar', length: 45})
    @Length(3, 45, {groups: ['create','update']})
    cellphone: string;

    @ManyToOne(() => Municipality, { nullable: true })
    @JoinColumn({ name:'id_municipio' })
    municipality: Municipality | null;

    @CreateDateColumn({name:'fecha_registro'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

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
