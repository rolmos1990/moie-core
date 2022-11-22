import {
    Column,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsDecimal, IsOptional, Length} from "class-validator";
import {Type} from "class-transformer";
import {Attachment} from "./Attachment";

@Entity({name: 'Movement'})
export class Movement extends BaseModel {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 255})
    @Length(0, 255, {groups: ['create', 'update']})
    description: string;

    @Column({name:'amount', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    amount: number;

    @Column({name:'date', type: 'datetime'})
    @Type(() => Date)
    @IsDate()
    date: Date;

    @Column({type: 'varchar', length: 255})
    @Length(0, 255, {groups: ['create', 'update']})
    comment: string;

    @OneToMany(() => Attachment, attachments => attachments.movement)
    attachments: Attachment[];

    @Column({type: 'boolean'})
    @IsOptional()
    canceled: boolean;

    isEmpty() : boolean{
        return (this.id == null);
    }
}
