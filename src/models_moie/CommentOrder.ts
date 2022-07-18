import {
    Column, CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {Type} from "class-transformer";
import {Order} from "./Order";
import {User} from "./User";

@Entity({database: OriginalDatabaseName, name: 'observacion', orderBy: {id: 'ASC'}, synchronize: false})
export class CommentOrder extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'contenido', type: 'varchar', length: 1500})
    @Length(3, 255, {groups: ['create','update']})
    message: string;

    @ManyToOne(() => User)
    @JoinColumn({name:'id_usuario_origen'})
    user: User;

    @ManyToOne(() => Order)
    @JoinColumn({name:'id_venta'})
    order: Order;

    @CreateDateColumn({name:'fecha'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(){
        return (this.id == null);
    }
}
