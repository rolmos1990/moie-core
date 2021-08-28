import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, ManyToOne, OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsInt, Length} from "class-validator";
import {Type} from "class-transformer";
import {Order} from "./Order";
import {Customer} from "./Customer";
import {BillConfig} from "./BillConfig";
import {OrderDetail} from "./OrderDetail";
import {BillCreditMemo} from "./BillCreditMemo";

@Entity({name: 'Bill'})
export class Bill extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => Order, order => order.id)
    @JoinColumn({name: 'order_id'})
    order: Order;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @Column({name:'tax', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    tax: number;

    @Column({name:'legal_number', type: 'bigint'})
    @IsInt({groups: ['create','update']})
    legalNumber: number;

    @ManyToOne(() => BillConfig)
    @JoinColumn({name: 'bill_config_id'})
    billConfig: BillConfig;

    @Column({name:'status', type: 'varchar', length: 100})
    @IsBoolean({groups: ['create','update']})
    status: string;

    @OneToOne(() => BillCreditMemo, billCreditMemo => billCreditMemo.bill)
    creditMemo: BillCreditMemo;

    isEmpty(): boolean {
        return false;
    }

}
