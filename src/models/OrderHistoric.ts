import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {Order} from "./Order";
import {User} from "./User";

@Entity({name: 'OrderHistoric'})
export class OrderHistoric extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order)
    @JoinColumn({name: 'order_id'})
    order: Order;

    @Column({name:'status', type: 'integer'})
    @IsNumber()
    status: number;

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
