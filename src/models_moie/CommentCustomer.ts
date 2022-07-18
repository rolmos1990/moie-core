import {
    Column, CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {Type} from "class-transformer";
import {User} from "./User";
import {Customer} from "./Customer";

@Entity({database: OriginalDatabaseName, name: 'observacion_cliente', orderBy: {id: 'ASC'}, synchronize: false})
export class CommentCustomer extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'contenido', type: 'varchar', length: 1500})
    message: string;

    @ManyToOne(() => User)
    @JoinColumn({name:'id_usuario_origen'})
    user: User;

    @ManyToOne(() => Customer)
    @JoinColumn({name:'id_cliente'})
    customer: Customer;

    @CreateDateColumn({name:'fecha'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(){
        return (this.id == null);
    }
}
