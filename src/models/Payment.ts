import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsDecimal, IsOptional, Length} from "class-validator";
import {Type} from "class-transformer";
import {Order} from "./Order";
import {User} from "./User";

@Entity({name: 'Payment'})
export class Payment extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'name', type: 'varchar', length: 300})
    @Length(3, 100, {groups: ['create','update']})
    name: string;

    @Column({type: 'varchar', length: 30})
    @Length(3, 11, {groups: ['create','update']})
    phone: string;

    /** forma */
    @Column({name:'type', type: 'varchar', length: 255})
    @Length(3, 100, {groups: ['create','update']})
    type: string;

    @Column({name:'bank', type: 'varchar', length: 255})
    @Length(3, 100, {groups: ['create','update']})
    bank: string;

    @Column({name:'number', type: 'varchar', length: 255})
    @Length(3, 100, {groups: ['create','update']})
    number: string;

    @Column({name:'amount', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    amount: number;

    @Column({name:'email', type: 'varchar', length: 255})
    @Length(3, 100, {groups: ['create','update']})
    email: string;

    @Column({name:'origen', type: 'varchar', length: 150, nullable: true})
    @Length(3, 150, {groups: ['create','update']})
    @IsOptional()
    origen: string;

    @OneToOne(() => Order, order => order.payment) // specify inverse side as a second parameter    user: User;
    order: Order;

    @ManyToOne(() => User, {nullable: true})
    @JoinColumn({name: 'user_id'})
    user: User;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
