import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, Length} from "class-validator";
import {Type} from "class-transformer";
import {Product} from "./Product";
import {OriginalDatabaseName, StoreDatabaseName} from "../common/persistence";

@Entity({database: StoreDatabaseName, name: 'categoria', orderBy: {id: 'ASC'}})
export class Category extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'nombre', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @CreateDateColumn({name:'actualizacion'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn({name:'actualizacion', nullable: true})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    isEmpty(): boolean {
        return false;
    }

}
