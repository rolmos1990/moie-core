import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsInt, Length} from "class-validator";
import {Type} from "class-transformer";
import {Municipality} from "./Municipality";
import {Product} from "./Product";

@Entity({name: 'Bill'})
export class Bill extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'name', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    order: string;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @Column({name:'tax', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    tax: number;

    @Column({name:'legal_number', type: 'bigint'})
    @IsInt({groups: ['create','update']})
    legal_number: number;

    @Column({name:'name', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    billConfig: string;

    @Column({name:'name', type: 'varchar', length: 100})
    @IsBoolean({groups: ['create','update']})
    status: string;

    isEmpty(): boolean {
        return false;
    }

}
