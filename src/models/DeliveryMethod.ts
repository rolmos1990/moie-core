import {
    Column, CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDate, IsEnum, Length} from "class-validator";
import {Type} from "class-transformer";
import {DeliveryTypes} from "../common/enum/deliveryTypes";

export type DeliveryTypes = DeliveryTypes.PREVIOUS_PAYMENT | DeliveryTypes.PAY_ONLY_DELIVERY | DeliveryTypes.CHARGE_ON_DELIVERY;

@Entity({name: 'DeliveryMethod', orderBy: {id: 'DESC'}})
export class DeliveryMethod extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 255})
    @Length(3, 255, {groups: ['create','update']})
    code: string;

    @Column({type: 'varchar', length: 255})
    @Length(3, 255, {groups: ['create','update']})
    name: string;

    @Column({ type: "enum",  enum: [
            DeliveryTypes.PREVIOUS_PAYMENT,
            DeliveryTypes.PAY_ONLY_DELIVERY,
            DeliveryTypes.CHARGE_ON_DELIVERY],
            default: DeliveryTypes.PREVIOUS_PAYMENT
    })
    @IsEnum(DeliveryTypes)
    settings: DeliveryTypes[];

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    @CreateDateColumn({name:'created_at'})
    @Type(() => Date)
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at', nullable: true})
    @Type(() => Date)
    @IsDate()
    updatedAt: Date;

    equals(obj: any) {
        if(obj instanceof DeliveryMethod === false){
            return false;
        }
        if(obj.id === this.id){
            return true;
        }
        return false;
    }

    toString(){
        return DeliveryMethod.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
