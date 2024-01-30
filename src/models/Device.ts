import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, Length} from "class-validator";
import {Type} from "class-transformer";

@Entity({name: 'Device'})
export class Device extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'device', type: 'varchar', length: 600})
    @Length(1, 255, {groups: ['create','update']})
    device: string;

    @Column({name:'alias', type: 'varchar', length: 100})
    @Length(0, 100, {groups: ['create','update']})
    alias: string;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    isActive() {
        return this.status == true;
    }

    isPending() {
        return this.status == false;
    }

    setPending() {
        this.status = false;
    }

    setActive() {
        this.status = true;
    }

    createNew(deviceId){
        this.device = deviceId;
        this.status = false;
        this.alias = '';
        this.createdAt = new Date();
    }

    refreshDate(){
        this.updatedAt = new Date();
    }

    isEmpty(): boolean {
        return false;
    }

}
