import {IsBoolean, IsNumber, IsOptional, IsString, validate} from "class-validator";
import {OrderProduct} from "./orderProduct";
import {InvalidArgumentException} from "../../common/exceptions";
import {Order as OrderModel} from '../../models/Order';
import {DeliveryMethodListDTO} from "./deliveryMethod";
import {CustomerListDTO, CustomerShortDTO} from "./customer";


export const OrderCreateDTO = async (order: any) => {
    try {
        if (!(order.products && order.products.length > 0)) {
            throw new InvalidArgumentException("Cantidad de productos es requerida");
        }
        const products = await Promise.all(order.products.map(async item => {
            try {
                const orderProduct = new OrderProduct(item);
                const errors = await validate(orderProduct);

                if(errors.length > 0){
                    throw new InvalidArgumentException("Producto "+ item.name + " es invalido");
                }

                return orderProduct;
            }catch(e){
                return new InvalidArgumentException("Datos invalidos");
            }
        }));
        order.products = products;
        order = new Order(order);
        const orderErrors = await validate(order);
        if(orderErrors.length > 0){
            return new InvalidArgumentException("Datos invalidos");
        }
        return order;
    }catch(e){
        return new InvalidArgumentException("Datos invalidos");
    }
}

export class Order {
    constructor(props){
        this.customer = props.customer;
        this.chargeOnDelivery = props.chargeOnDelivery;
        this.deliveryCost = props.deliveryCost;
        this.deliveryMethod = props.deliveryMethod;
        this.deliveryType = props.deliveryType;
        this.origen = props.origen;
        this.pieces = props.pieces;
        this.products = props.products;
    }
    @IsNumber()
    customer: number;

    @IsBoolean()
    chargeOnDelivery: boolean;

    @IsNumber()
    @IsOptional()
    deliveryCost: number;

    @IsString()
    deliveryMethod: string;

    @IsNumber()
    @IsOptional()
    deliveryType: number;

    @IsString()
    origen: string;

    @IsNumber()
    pieces: number

    products: OrderProduct[]
}

export const OrderListDTO = (order: OrderModel) => ({
    id: order.id,
    deliveryCost: order.deliveryCost,
    chargeOnDelivery: order.chargeOnDelivery,
    origen: order.origen,
    totalAmount: order.totalAmount,
    totalDiscount: order.totalDiscount,
    totalRevenue: order.totalRevenue,
    totalWeight: order.totalWeight,
    tracking: order.tracking,
    remember: order.remember,
    deliveryType: order.deliveryType,
    expiredDate: order.expiredDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    quantity: order.orderDetails && order.orderDetails.length,
    customer: CustomerShortDTO(order.customer),
    deliveryMethod: DeliveryMethodListDTO(order.deliveryMethod)
});


export const OrderShowDTO = (order: OrderModel) => ({
    id: order.id,
    deliveryCost: order.deliveryCost,
    chargeOnDelivery: order.chargeOnDelivery,
    origen: order.origen,
    totalAmount: order.totalAmount,
    totalDiscount: order.totalDiscount,
    totalRevenue: order.totalRevenue,
    totalWeight: order.totalWeight,
    tracking: order.tracking,
    remember: order.remember,
    deliveryType: order.deliveryType,
    expiredDate: order.expiredDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    quantity: order.orderDetails && order.orderDetails.length,
    orderDetails: order.orderDetails,
    customer: CustomerListDTO(order.customer),
    deliveryMethod: DeliveryMethodListDTO(order.deliveryMethod)
});
