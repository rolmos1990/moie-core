import {
    Column, CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsDecimal} from "class-validator";
import {Type} from "class-transformer";

@Entity({name: 'EventItem'})
export class EventItems extends BaseModel {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'event_type', type: 'integer'})
    eventType: number;

    @Column({name:'amount', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    amount: number;

    @CreateDateColumn({name:'updated_at'})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    isEmpty() : boolean{
        return (this.id == null);
    }
}
