import {
    Column, CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {Type} from "class-transformer";
import {User} from "./User";
import {OrderPostSale} from "./OrderPostSale";

@Entity({database: OriginalDatabaseName, name: 'observacion_postventa', orderBy: {id: 'ASC'}, synchronize: false})
export class CommentPostSale extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'contenido', type: 'varchar', length: 1500})
    @Length(3, 255, {groups: ['create','update']})
    message: string;

    @ManyToOne(() => User)
    @JoinColumn({name:'id_usuario'})
    user: User;

    @ManyToOne(() => OrderPostSale)
    @JoinColumn({name:'id_postventa'})
    orderPostSale: OrderPostSale;

    @CreateDateColumn({name:'fecha'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(){
        return (this.id == null);
    }
}
