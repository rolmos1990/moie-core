import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsInt, IsString} from "class-validator";
import {Type} from "class-transformer";
import {NewDatabaseName} from "../common/persistence";

@Entity({database: NewDatabaseName, name: 'Bill'})
export class Bill extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'order_id', type: 'integer'})
    order: number;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @Column({name:'tax', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    tax: number;

    @Column({name:'legal_number', type: 'bigint', nullable: true})
    @IsInt({groups: ['create','update']})
    legalNumber: number;

    @Column({name:'bill_config_id', type: 'integer'})
    billConfig: number;

    @Column({name:'status', type: 'varchar', length: 100})
    @IsBoolean({groups: ['create','update']})
    status: string;

    @Column({name:'dianLog', type: 'text', nullable: true})
    @IsString({groups: ['create','update']})
    dianLog: string;

    @Column({name:'dianCreditMemoLog', type: 'text', nullable: true})
    @IsString({groups: ['create','update']})
    dianCreditMemoLog: string;

    isEmpty(): boolean {
        return false;
    }

}
