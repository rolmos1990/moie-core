import {
    Column, CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsDecimal, Length} from "class-validator";
import {Type} from "class-transformer";
import {Movement} from "./Movement";

@Entity({name: 'Attachment'})
export class Attachment extends BaseModel {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Movement, movement => movement.attachments)
    @JoinColumn({name:'movement_id'})
    movement: Movement;

    @Column({type: 'varchar', length: 255})
    @Length(0, 255, {groups: ['create', 'update']})
    type: string;

    @Column({type: 'varchar', length: 255})
    @Length(0, 255, {groups: ['create', 'update']})
    description: string;

    isEmpty() : boolean{
        return (this.id == null);
    }
}
