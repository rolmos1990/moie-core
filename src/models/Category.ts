import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, Length} from "class-validator";
import {Type} from "class-transformer";
import {Municipality} from "./Municipality";
import {Product} from "./Product";

@Entity({name: 'Category'})
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

    @Column({name:'filename', type: 'varchar', length: 100})
    @Length(3, 255, {groups: ['create','update']})
    filename: string;

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    @Column({name:'discount_percent', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    discountPercent: number;

    isEmpty(): boolean {
        return false;
    }

}
