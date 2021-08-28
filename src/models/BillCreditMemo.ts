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
    bill: string;

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
