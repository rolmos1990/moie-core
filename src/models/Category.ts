import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, Length} from "class-validator";
import {Type} from "class-transformer";
import {Municipality} from "./Municipality";
import {Product} from "./Product";
import {NewDatabaseName} from "../common/persistence";
import {Product as ProductWeb} from "../models_web/Product";
import {Category as CategoryWeb} from "../models_web/Category";

@Entity({database: NewDatabaseName, name: 'Category', orderBy: {id: 'ASC'}})
export class Category extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'name', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];

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

    isEmpty(): boolean {
        return false;
    }

}
