import {
    Column, CreateDateColumn,
    Entity, JoinColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, Length, MinLength} from "class-validator";
import {Type} from "class-transformer";

@Entity({name: 'Template'})
export class Template extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 100, unique: true})
    @Length(1, 100, {groups: ['create','update']})
    reference: string;

    @Column({type: 'varchar', length: 100})
    @Length(1, 100, {groups: ['create','update']})
    description: string;

    @Column({name:'text', type: 'text'})
    @MinLength(1,  {groups: ['create','update']})
    template: string;

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    @Column({name:'has_editor', type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    hasEditor: boolean;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    equals(obj: any) {
        if(obj instanceof Template === false){
            return false;
        }
        if(obj.id === this.id){
            return true;
        }
        return false;
    }

    toString(){
        return Template.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
