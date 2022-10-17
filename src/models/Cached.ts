import {
    Column,
    Entity,
    PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Type} from "class-transformer";
import {IsDate} from "class-validator";

@Entity({name: 'Cached'})
export class Cached extends BaseModel {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("simple-json")
    json: string;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    isEmpty(): boolean {
        return false;
    }
}
