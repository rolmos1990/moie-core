import {
    Column,
    Entity, JoinColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";
//test
@Entity({name: 'Attachment'})
export class Attachment extends BaseModel {
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({name:'movement_id', type: 'int'})
    movement: number;

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
