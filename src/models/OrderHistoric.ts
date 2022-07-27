import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {NewDatabaseName} from "../common/persistence";

@Entity({database: NewDatabaseName, name: 'OrderHistoric'})
export class OrderHistoric extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'order_id', type: 'integer'})
    order: number;

    @Column({name:'status', type: 'integer'})
    @IsNumber()
    status: number;

    @Column({name:'user_id', type: 'integer'})
    user: number;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
