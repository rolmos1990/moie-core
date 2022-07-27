import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsInt} from "class-validator";
import {Type} from "class-transformer";
import {NewDatabaseName} from "../common/persistence";

@Entity({database: NewDatabaseName, name: 'BillConfig'})
export class BillConfig extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'number', type: 'varchar', length: 100})
    number: string;

    @Column({name:'start_number', type: 'bigint'})
    @IsInt({groups: ['create','update']})
    startNumber: number;

    @Column({name:'final_number', type: 'bigint'})
    @IsInt({groups: ['create','update']})
    finalNumber: number;

    @Column({name:'prefix', type: 'varchar', length: 5})
    prefix: string;

    @Column({name:'resolution_date', type: 'varchar', length: 100, unique: true})
    resolutionDate: string;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    @Column({type: 'boolean'})
    status: boolean;

    isEmpty(): boolean {
        return false;
    }

}
