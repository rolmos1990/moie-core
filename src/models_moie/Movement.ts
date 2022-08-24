import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsDecimal, Length} from "class-validator";
import {Type} from "class-transformer";
import {OriginalDatabaseName} from "../common/persistence";

@Entity({database: OriginalDatabaseName, name: 'movimiento', orderBy: {id: 'ASC'}, synchronize: false})
export class Movement extends BaseModel {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name: 'descripcion', type: 'varchar', length: 255})
    description: string;

    @Column({name:'monto', type: 'decimal'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    amount: number;

    @Column({name:'fecha', type: 'datetime'})
    @Type(() => Date)
    @IsDate()
    date: Date;

    @Column({name:'observacion', type: 'varchar', length: 255})
    @Length(0, 255, {groups: ['create', 'update']})
    comment: string;

    isEmpty() : boolean{
        return (this.id == null);
    }
}
