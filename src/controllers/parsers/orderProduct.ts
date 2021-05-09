import { IsNumber, IsInt } from 'class-validator';

/**
 * Parse - Producto dentro de las ordenes
 */
export class OrderProduct {

    constructor(props) {
        this.id = props.id;
        this.productSize = props.productSize;
        this.quantity = props.quantity;
        this.discountPercentage = props.discountPercentage;
    }

    @IsInt()
    id: string;
    @IsInt()
    productSize: number;
    @IsInt()
    quantity: number;
    @IsNumber()
    discountPercentage: number;
}
