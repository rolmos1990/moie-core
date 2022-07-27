import {
    Column, CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, Length} from "class-validator";
import {Type} from "class-transformer";
import {User} from "./User";
import {NewDatabaseName} from "../common/persistence";

@Entity({database: NewDatabaseName, name: 'Comment'})
export class Comment extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 255})
    @Length(3, 255, {groups: ['create','update']})
    entity: string;

    @Column({type: 'varchar', length: 255})
    idRelated: string;

    @Column({type: 'varchar', length: 2200})
    comment: string;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: number;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    equals(obj: any) {
        if(obj instanceof Comment === false){
            return false;
        }
        if(obj.id === this.id){
            return true;
        }
        return false;
    }

    toString(){
        return Comment.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
