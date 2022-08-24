import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsDecimal, Length} from "class-validator";
import {Type} from "class-transformer";

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

    isEmpty() : boolean{
        return (this.id == null);
    }
}
