import {
    Column,
    Entity, JoinColumn, ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsEmail, Length, IsBoolean} from "class-validator";
import {NewDatabaseName} from "../common/persistence";
import {Product} from "./Product";
import {Customer} from "./Client";

@Entity({database: NewDatabaseName, name: 'TemporalAddress', orderBy: {id: 'DESC'}})
export class TemporalAddress extends BaseModel {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 255})
    @Length(0, 255, {groups: ['create', 'update']})
    state: string;

    @Column({type: 'varchar', length: 255})
    @Length(0, 255, {groups: ['create', 'update']})
    municipality: string;

    @OneToOne(() => Customer, client => client.id)
    @JoinColumn({name:'client_id'})
    client: Customer;

    isEmpty() : boolean{
        return (this.id == null);
    }
}
