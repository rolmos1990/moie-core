import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsEmail, Length, IsBoolean, IsNumber, IsDecimal} from "class-validator";
import { Type } from 'class-transformer';
import {Municipality} from "./Municipality";
import {State} from "./State";
import {TemporalAddress} from "./TemporalAddress";
import {Order} from "./Order";

@Entity({name: 'customerorder'})

export class ViewCustomerOrder extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    /** TODO -- se agrega documento en customer */
    @Column({type: 'varchar', length: 100})
    @Length(3, 100, {groups: ['create','update']})
    document: string;

    @Column({type: 'varchar', length: 100})
    @Length(3, 100, {groups: ['create','update']})
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
    cellphone: string;

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

    @OneToMany(() => TemporalAddress, municipality => municipality.state)
    municipalities: Municipality[];

    @Column({type: 'varchar', length: 300, nullable: true})
    @Length(0, 300, {groups: ['create','update']})
    address: string;


    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @OneToMany(() => TemporalAddress, temporalAddress => temporalAddress.customer)
    temporalAddress: TemporalAddress[];

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    @Column({name:'order_count', type: 'integer'})
    @IsNumber()
    orderCount: number;

    @Column({name:'total_amount', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'})
    totalAmount: number;

    equals(obj: any) {
        if(obj instanceof ViewCustomerOrder === false){
            return false;
        }
        if(obj.id === this.id){
            return true;
        }
        return false;
    }

    toString(){
        return ViewCustomerOrder.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
