import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsInt, Length} from "class-validator";
import {Type} from "class-transformer";

@Entity({name: 'Bill'})
export class Bill extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'name', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    number: string;

    @Column({name:'start_number', type: 'bigint'})
    @IsInt({groups: ['create','update']})
    startNumber: number;

    @Column({name:'final_number', type: 'bigint'})
    @IsInt({groups: ['create','update']})
    finalNumber: number;

    @Column({name:'prefix', type: 'varchar', length: 5})
    @Length(1, 5, {groups: ['create','update']})
    prefix: string;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    isEmpty(): boolean {
        return false;
    }

}
