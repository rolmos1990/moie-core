import {
    Column, CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {User} from "./User";
import {Type} from "class-transformer";

@Entity({database: OriginalDatabaseName, name: 'historial', orderBy: {id: 'ASC'}, synchronize: false})
export class OrderHistoric extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'objeto', type: 'varchar', length: 200})
    @Length(3, 200, {groups: ['create','update']})
    entity: string;

    @Column({name:'id_objeto', type: 'varchar', length: 10})
    entityId: string;

    @Column({name:'accion', type: 'varchar', length: 30})
    status: string;

    @ManyToOne(() => User)
    @JoinColumn({name:'id_usuario'})
    user: User;

    @CreateDateColumn({name:'fecha'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(){
        return (this.id == null);
    }
}
