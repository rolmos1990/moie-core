import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate} from "class-validator";
import {Type} from "class-transformer";
import {Bill} from "./Bill";

@Entity({name: 'BillCreditMemo'})
export class BillCreditMemo extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => Bill, bill => bill.creditMemo)
    @JoinColumn({name: 'bill_id'})
    bill: Bill;

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(): boolean {
        return false;
    }

}
