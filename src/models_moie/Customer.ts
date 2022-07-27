import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToOne, OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsEmail, Length} from "class-validator";
import { Type } from 'class-transformer';
import {Municipality} from "./Municipality";
import {OriginalDatabaseName} from "../common/persistence";
import {Customer as ClientNew} from "../models/Customer";

@Entity({database: OriginalDatabaseName, name: 'cliente', orderBy: {id: 'DESC'}, synchronize: false})
export class Customer extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name: 'ci', type: 'varchar', length: 255})
    @Length(3, 40, {groups: ['create','update']})
    ci: string;

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

    //address
    @Column({name:'ciudad', type: 'varchar', length: 255})
    city: string;

    @Column({name:'estado', type: 'varchar', length: 255})
    state: string;

    @ManyToOne(() => Municipality, { nullable: true })
    @JoinColumn({ name:'id_municipio' })
    municipality: Municipality | null;

    @CreateDateColumn({name:'fecha_registro', nullable: true})
    @Type(() => Date)
    @IsDate()
    createdAt?: Date;

    toString(){
        return Customer.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
