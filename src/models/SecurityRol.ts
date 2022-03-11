import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";
import {SecurityPermission} from "./SecurityPermission";

@Entity({name: 'security_rol'})
export class SecurityRol extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'name', type: 'varchar', length: 100})
    @Length(3, 100, {groups: ['create','update']})
    name: string;

    @ManyToMany(() => SecurityPermission)
    @JoinTable()
    permissions: SecurityPermission[];

    isEmpty(): boolean {
        return (this.id == null);
    }

}
