import {
    Column, CreateDateColumn,
    Entity, JoinColumn, OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsInt, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";
import {Bill} from "./Bill";
import {Type} from "class-transformer";

@Entity({database: OriginalDatabaseName, name: 'nota_credito', orderBy: {id: 'ASC'}, synchronize: false})
export class BillCreditMemo extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => Bill, {onDelete: "CASCADE"})
    @JoinColumn({name: 'id_factura'})
    bill: Bill;

    @Column({name: 'enviada', type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    //Enviada, ''
    @Column({name:'track_id', type: 'varchar', length: 100, unique: true})
    trackId: string;

    @CreateDateColumn({name:'fecha'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    isEmpty(){
        return (this.id == null);
    }
}
