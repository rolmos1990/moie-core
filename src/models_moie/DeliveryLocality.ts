import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import BaseModel from "../common/repositories/base.model";
import {IsDecimal, IsInt, Length} from "class-validator";
import {OriginalDatabaseName} from "../common/persistence";

@Entity({database: OriginalDatabaseName, name: 'localidad', orderBy: {id: 'ASC'}})
export class DeliveryLocality extends BaseModel{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name: 'nombre', type: 'varchar', length: 255})
    @Length(3, 255, {groups: ['create','update']})
    name: string;

    @Column({name:'codigo_interrapidisimo', type: 'varchar', length: 100})
    @Length(3, 100, {groups: ['create','update']})
    deliveryAreaCode: string;

    @Column({name:'entrega', type: 'integer'})
    @IsInt({groups: ['create','update']})
    timeInDays: string;

    @Column({name:'pago', type: 'integer'})
    @IsInt({groups: ['create','update']})
    deliveryType: number;

    @Column({name:'primer_kilo', type: 'double'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    priceFirstKilo: number;

    @Column({name:'kilo_adicional', type: 'double'})
    @IsDecimal({ decimal_digits: '2'}, {groups: ['create','update']})
    priceAdditionalKilo: number;

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
