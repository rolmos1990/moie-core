import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsDecimal, IsOptional, Length, MaxLength} from "class-validator";
import {Type} from "class-transformer";
import {ProductSize} from "./ProductSize";
import {Size} from "./Size";
import {Category} from "./Category";
import {ProductImage} from "./ProductImage";
import {NewDatabaseName} from "../common/persistence";

@Entity({database: NewDatabaseName, name: 'Product', orderBy: {id: 'ASC'}})
export class Product extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'reference', type: 'varchar', length: 100, unique: true})
    @Length(3, 255, {groups: ['create','update']})
    reference: string;

    @Column({name:'name', type: 'varchar', length: 255})
    @Length(3, 255, {groups: ['create','update']})
    name: string;

    @Column({name:'description', type: 'varchar', length: 800, nullable: true})
    @MaxLength(800, {groups: ['create','update']})
    description: string;

    @Column({name:'material', type: 'varchar', length: 150, nullable: true})
    @Length(3, 150, {groups: ['create','update']})
    material: string;

    @Column({name:'provider', type: 'varchar', length: 150, nullable: true})
    @Length(3, 150, {groups: ['create','update']})
    provider: string;

    @Column({name:'price', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    price: number;

    @Column({name:'cost', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    cost: number;

    @Column({name:'discount', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    discount: number;

    @Column({name:'weight', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    weight: number;

    /* campo sirve_para permitira agregar unos tags adicionales */
    @Column({name:'tags', type: 'varchar', length: 255, nullable: true})
    @IsOptional()
    @MaxLength(255, {groups: ['create','update']})
    tags: string;

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({name:'category_id'})
    category: Category;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    @ManyToOne(() => Size)
    @JoinColumn({name: 'size_id'})
    size: number;

    @OneToMany(() => ProductSize, productSize => productSize.product)
    productSize: ProductSize[];

    @OneToMany(() => ProductImage, productImage => productImage.product)
    productImage: ProductImage[];

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
