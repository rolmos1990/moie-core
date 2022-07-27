import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToMany, OneToOne, PrimaryColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsDecimal, IsOptional, Length, MaxLength} from "class-validator";
import {Type} from "class-transformer";
import {SizeOriginal} from "./Size";
import {ProductSize} from "../models/ProductSize";
import {OriginalDatabaseName} from "../common/persistence";
import {Product as ProductNew} from '../models/Product';

/**
 * Product Versión Moie - Relacionado con los productos nuevos.
 */
@Entity({database: OriginalDatabaseName, name: 'producto', orderBy: {id: 'ASC'}, synchronize: false})
export class ProductWithNew extends BaseModel{

    @PrimaryColumn({name:'id', type: 'varchar', length: 20})
    id: string;

    @Column({name:'descripcion', type: 'varchar', length: 255})
    @Length(3, 255, {groups: ['create','update']})
    name: string;

    @Column({name:'marca', type: 'varchar', length: 800, nullable: true})
    @MaxLength(800, {groups: ['create','update']})
    brand: string;

    @Column({name:'material', type: 'varchar', length: 150, nullable: true})
    @Length(3, 150, {groups: ['create','update']})
    material: string;

    @Column({name:'proveedor', type: 'varchar', length: 150, nullable: true})
    @Length(3, 150, {groups: ['create','update']})
    provider: string;

    @Column({name:'precio', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    price: number;

    @Column({name:'costo', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    cost: number;

    @ManyToOne(() => SizeOriginal)
    @JoinColumn({name: 'id_talla'})
    size: number;

    @Column({name:'peso', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    weight: number;

    @Column({name:'sirve_para', type: 'varchar', length: 255, nullable: true})
    @IsOptional()
    @MaxLength(255, {groups: ['create','update']})
    tags: string;

    @CreateDateColumn({name:'fecha'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @OneToMany(() => ProductSize, productSize => productSize.product)
    productSize: ProductSize[];

    @OneToOne(() => ProductNew)
    @JoinColumn({name: "id", referencedColumnName: "reference"})
    productNew: ProductNew;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
