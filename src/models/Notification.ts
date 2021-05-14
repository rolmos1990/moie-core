import {
    Column, CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsJSON, Length} from "class-validator";
import {State} from "./State";
import {User} from "./User";
import {Type} from "class-transformer";

@Entity({name: 'Notification'})
export class Notification extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 200})
    @Length(3, 200, {groups: ['create','update']})
    title: string;

    @Column({name:'dian_code', type: 'varchar', length: 1000})
    @Length(3, 10, {groups: ['create','update']})
    @IsJSON()
    body: string;

    @Column({type: 'varchar', length: 200})
    @Length(3, 100, {groups: ['create','update']})
    type: string;

    @ManyToOne(() => User, user => user.notifications, { onDelete: 'CASCADE' })
    @JoinColumn({name:'user_id'})
    user: User;

    @ManyToOne(() => State, state => state.municipalities, { onDelete: 'CASCADE' })
    @JoinColumn({name:'state_id'})
    status: State;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    equals(obj: any) {
        if(obj instanceof Notification === false){
            return false;
        }
        if(obj.id === this.id){
            return true;
        }
        return false;
    }

    toString(){
        return Notification.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
