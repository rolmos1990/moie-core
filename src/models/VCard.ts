import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, Length} from "class-validator";
import {Type} from "class-transformer";

@Entity({name: 'VCard'})
export class VCard extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'name', type: 'varchar', length: 300})
    @Length(1, 200, {groups: ['create','update']})
    name: string;

    @Column({type: 'varchar', length: 30})
    @Length(1, 100, {groups: ['create','update']})
    phone: string;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
