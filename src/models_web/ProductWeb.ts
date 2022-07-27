import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToOne, PrimaryColumn
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsDecimal, MaxLength} from "class-validator";
import {Type} from "class-transformer";
import {CategoryWeb} from "./CategoryWeb";
import {StoreDatabaseName} from "../common/persistence";
import {ProductOriginal} from '../models_moie/Product';

@Entity({database: StoreDatabaseName, name: 'producto', orderBy: {id: 'ASC'}, synchronize: false})
export class ProductWeb extends BaseModel{

    @PrimaryColumn({name:'codigo', type: 'varchar', length: 255})
    @OneToOne(() => ProductOriginal)
    @JoinColumn({name: "codigo"})
    codigo: string;

    @Column({name:'observaciones', type: 'varchar', length: 800, nullable: true})
    @MaxLength(800, {groups: ['create','update']})
    description: string;

    @Column({name:'imagenes', type: 'integer'})
    @MaxLength(800, {groups: ['create','update']})
    imagenes: number;

    @Column({name:'descuento_especial', type: 'decimal', nullable: true, default: 0})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    discount: number;

    @ManyToOne(() => CategoryWeb, category => category.products)
    @JoinColumn({name:'id_categoria'})
    category: CategoryWeb;

    @CreateDateColumn({name:'fecha'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(): boolean {
        return (this.codigo == null);
    }

}
