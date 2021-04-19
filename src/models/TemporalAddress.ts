import {
    Column,
    Entity, JoinColumn, ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";
import {Customer} from "./Customer";
import {State} from "./State";

@Entity({name: 'TemporalAddress', orderBy: {id: 'DESC'}})
export class TemporalAddress extends BaseModel {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 255})
    @Length(0, 255, {groups: ['create', 'update']})
    state: string;

    @Column({type: 'varchar', length: 255})
    @Length(0, 255, {groups: ['create', 'update']})
    municipality: string;

    @ManyToOne(() => Customer, customer => customer.temporalAddress)
    @JoinColumn({name:'customer_id'})
    customer: Customer;

    isEmpty() : boolean{
        return (this.id == null);
    }
}
