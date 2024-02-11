import {
    Column, CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsDecimal} from "class-validator";
import {Type} from "class-transformer";
import {User} from "./User";

@Entity({name: 'Items'})
export class Items extends BaseModel {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'amount', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    amount: string;

    @Column({name:'type', type: 'integer'})
    type: number; //1->InterrapidisimoCredit, 2-> Bags

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty() : boolean{
        return (this.id == null);
    }
}
