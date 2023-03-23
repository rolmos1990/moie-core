import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length, MinLength} from "class-validator";

@Entity({name: 'template_catalog'})
export class TemplateCatalog extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 100})
    @Length(1, 100, {groups: ['create','update']})
    description: string;

    @Column({name:'template', type: 'text'})
    @MinLength(1,  {groups: ['create','update']})
    template: string;

    @Column({name:'minified', type: 'text'})
    @MinLength(1,  {groups: ['create','update']})
    minified: string;

    equals(obj: any) {
        if(obj instanceof TemplateCatalog === false){
            return false;
        }
        if(obj.id === this.id){
            return true;
        }
        return false;
    }

    toString(){
        return TemplateCatalog.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
