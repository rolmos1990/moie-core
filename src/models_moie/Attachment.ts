import {
    Column,
    Entity, JoinColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";

@Entity({database: OriginalDatabaseName, name: 'adjunto', orderBy: {id: 'ASC'}, synchronize: false})
export class Attachment extends BaseModel {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'id_movimiento', type: 'int'})
    movement: number;

    @Column({name: 'tipo', type: 'varchar', length: 255})
    @Length(0, 255, {groups: ['create', 'update']})
    type: string;

    @Column({name:'descripcion', type: 'varchar', length: 255})
    description: string;

    isEmpty() : boolean{
        return (this.id == null);
    }
}
