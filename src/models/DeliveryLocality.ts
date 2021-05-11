import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsBoolean, IsDecimal, IsInt, Length} from "class-validator";

@Entity({name: 'DeliveryLocality'})
export class DeliveryLocality extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 255})
    @Length(3, 255, {groups: ['create','update']})
    name: string;

    @Column({name:'delivery_area_code', type: 'varchar', length: 100})
    @Length(3, 100, {groups: ['create','update']})
    deliveryAreaCode: string;

    @Column({name:'time_in_days', type: 'integer'})
    @IsInt({groups: ['create','update']})
    timeInDays: string;

    @Column({name:'delivery_type', type: 'integer'})
    @IsInt({groups: ['create','update']})
    deliveryType: number;

    @Column({name:'price_first_kilo', type: 'double'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    priceFirstKilo: number;

    @Column({name:'price_additional_kilo', type: 'double'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    priceAdditionalKilo: number;

    @Column({type: 'boolean'})
    @IsBoolean({groups: ['create','update']})
    status: boolean;

    equals(obj: any) {
        if(obj instanceof DeliveryLocality === false){
            return false;
        }
        if(obj.id === this.id){
            return true;
        }
        return false;
    }

    toString(){
        return DeliveryLocality.toString();
    }

    isEmpty(){
        return (this.id == null);
    }
}
