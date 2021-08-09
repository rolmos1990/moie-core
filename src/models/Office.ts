import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDate, IsNumber, IsOptional, Length} from "class-validator";
import {DeliveryMethod, DeliveryTypes} from "./DeliveryMethod";
import {Type} from "class-transformer";
import {User} from "./User";

//Equivalente a (despachos)
@Entity({name: 'Office'})
export class Office extends BaseModel{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name:'batchDate', type: 'datetime'})
    @Type(() => Date)
    @IsDate()
    batchDate: Date;

    @Column({name:'name', type: 'varchar', length: 60})
    @Length(3, 100, {groups: ['create','update']})
    name: string;

    @Column({name:'type', type: 'integer'})
    type: DeliveryTypes;

    @ManyToOne(() => DeliveryMethod)
    @JoinColumn({name: 'delivery_method_id'})
    deliveryMethod: DeliveryMethod;

    @Column({name:'description', type: 'varchar', length: 150})
    @Length(3, 150, {groups: ['create','update']})
    description: string;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({name:'status', type: 'integer'})
    @IsNumber()
    status: number;

    isEmpty(): boolean {
        return (this.id == null);
    }

}
