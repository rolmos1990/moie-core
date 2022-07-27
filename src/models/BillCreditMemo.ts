import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, Length} from "class-validator";
import {Type} from "class-transformer";
import {NewDatabaseName} from "../common/persistence";

@Entity({database: NewDatabaseName, name: 'BillCreditMemo'})
export class BillCreditMemo extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name: 'bill_id', type: 'integer'})
    bill: number;

    @Column({name:'memoType', type: 'varchar', length: 100})
    @Length(3, 50, {groups: ['create','update']})
    memoType: string;

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
