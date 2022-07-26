import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate} from "class-validator";
import {Type} from "class-transformer";
import {Product} from "./Product";
import {Category as CategoryNew} from "../models/Category";
import {StoreDatabaseName} from "../common/persistence";

@Entity({database: StoreDatabaseName, name: 'categoria', orderBy: {id: 'ASC'}, synchronize: false})
export class CategoryWeb extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'nombre', type: 'varchar', length: 100, unique: true})
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
