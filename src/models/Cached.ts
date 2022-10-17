import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";

@Entity({name: 'Cached'})
export class Cached extends BaseModel {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("simple-json")
    json: string;

    isEmpty(): boolean {
        return false;
    }
}
