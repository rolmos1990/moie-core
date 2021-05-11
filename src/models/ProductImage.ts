import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import { Length } from "class-validator";
import {Product} from "./Product";

/* THUMBS - */
/* [{path: 'folder/file.asd', size: 400}, {path: 'folder/file.asd', size: 200}] */

export const SIZES = {
    SMALL: 67,
    MEDIUM: 238,
    HIGH: 400,
    ORIGINAL: 800
};

@Entity({name: 'ProductImage'})
export class ProductImage extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'group', type: 'integer'})
    @Length(3, 255, {groups: ['create','update']})
    group: number;

    //TODO -- verificar en la migración que esto se llene */
    @Column({name:'thumbs', type: 'json'})
    @Length(3, 255, {groups: ['create','update']})
    thumbs: string;

    @Column({name:'filename', type: 'varchar', length: 100})
    @Length(3, 255, {groups: ['create','update']})
    filename: string;

    @Column({name:'path', type: 'varchar', length: 300})
    @Length(3, 255, {groups: ['create','update']})
    path: string;

    @ManyToOne(() => Product, product => product.productSize)
    @JoinColumn({name:'product_id'})
    product: Product;

    isEmpty(): boolean {
        return false;
    }
}
