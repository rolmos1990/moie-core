import {
    Column, CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {User} from "./User";
import {IsDate, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

@Entity({name: 'BatchRequest'})
export class BatchRequest extends BaseModel {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("simple-json")
    body: number;

    @Column({name:'type', type: 'integer'})
    type: number;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({name:'status', type: 'integer'})
    @IsNumber()
    status: number;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    updatedAt: Date;

    isEmpty(): boolean {
        return false;
    }
}
