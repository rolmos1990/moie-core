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
import {IsDate, Length} from "class-validator";
import {Type} from "class-transformer";
import {Product} from "./Product";
import {Category as CategoryNew} from "../models/Category";
import {OriginalDatabaseName, StoreDatabaseName} from "../common/persistence";
import {Product as ProductOriginal} from "../models_moie/Product";

@Entity({database: StoreDatabaseName, name: 'categoria', orderBy: {id: 'ASC'}})
export class Category extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'nombre', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @OneToOne(() => CategoryNew)
    @JoinColumn({name: "id"})
    categoryNew: CategoryNew;

    @CreateDateColumn({name:'actualizacion'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(): boolean {
        return false;
    }

}
