import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";

@Entity({name: 'security_permission'})
export class SecurityPermission extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'permission', type: 'varchar', length: 100})
    @Length(3, 100, {groups: ['create','update']})
    permission: string;

    @Column({name:'description', type: 'varchar', length: 300})
    @Length(3, 100, {groups: ['create','update']})
    description: string;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
