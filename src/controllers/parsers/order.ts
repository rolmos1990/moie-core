import {IsBoolean, IsNumber, IsOptional, IsString, validate} from "class-validator";
import {OrderProduct} from "./orderProduct";
import {InvalidArgumentException} from "../../common/exceptions";
import {Order as OrderModel} from '../../models/Order';
import {DeliveryMethodListDTO} from "./deliveryMethod";
import {CustomerListDTO, CustomerShortDTO} from "./customer";
import {DeliveryEnum} from "../../models/DeliveryMethod";
import {UserShortDTO} from "./user";
import {OrderDetail} from "../../models/OrderDetail";
import {ProductShortDTO} from "./product";
import {ProductSizeShort} from "./productSize";


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
        this.deliveryType = props.deliveryType;
        this.deliveryCost = props.deliveryCost;
        this.deliveryMethod = props.deliveryMethod;
        this.origen = props.origen;
        this.products = props.products;
        this.piecesForChanges = props.piecesForChanges;
        this.paymentMode = props.paymentMode;

        this.chargeOnDelivery = this.hasChargeOnDelivery(props);
    }

    hasChargeOnDelivery(props) : boolean{
        /** Cobro en la entrega */
        return props.deliveryType === DeliveryEnum.CHARGE_ON_DELIVERY ? true: false;
    }

    @IsNumber()
    customer: number;

    @IsNumber()
    @IsOptional()
    piecesForChanges: number;

    @IsNumber()
    @IsOptional()
    paymentMode: number;

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

    products: OrderProduct[]
}

export const OrderUpdateDTO = async (order: any) => {
    try {
        order = new OrderUpdate(order);
        const orderErrors = await validate(order);
        if(orderErrors.length > 0){
            return orderErrors[0].value;
        }
        return order;
    }catch(e){
        return new InvalidArgumentException("No podemos procesar su solicitud");
    }
}

export class OrderUpdate {
    constructor(props){
        this.customer = props.customer;
        this.deliveryType = props.deliveryType;
        this.deliveryCost = props.deliveryCost;
        this.deliveryMethod = props.deliveryMethod;
        this.origen = props.origen;
        this.piecesForChanges = props.piecesForChanges;
        this.paymentMode = props.paymentMode;

        this.chargeOnDelivery = this.hasChargeOnDelivery(props);
    }

    hasChargeOnDelivery(props) : boolean{
        /** Cobro en la entrega */
        return props.deliveryType === DeliveryEnum.CHARGE_ON_DELIVERY;
    }

    @IsNumber()
    @IsOptional()
    customer: number;

    @IsNumber()
    @IsOptional()
    piecesForChanges: number;

    @IsNumber()
    @IsOptional()
    paymentMode: number;

    @IsBoolean()
    @IsOptional()
    chargeOnDelivery: boolean;

    @IsNumber()
    @IsOptional()
    deliveryCost: number;

    @IsString()
    @IsOptional()
    deliveryMethod: string;

    @IsNumber()
    @IsOptional()
    deliveryType: number;

    @IsString()
    @IsOptional()
    origen: string;
}

export const OrderListDTO = (order: OrderModel) => ({
    id: order.id,
    deliveryCost: order.deliveryCost,
    chargeOnDelivery: order.chargeOnDelivery,
    origen: order.origen,
    totalAmount: order.totalAmount,
    subTotalAmount: order.subTotalAmount,
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
    subTotalAmount: order.subTotalAmount,
    totalDiscount: order.totalDiscount,
    totalRevenue: order.totalRevenue,
    totalWeight: order.totalWeight,
    tracking: order.tracking,
    remember: order.remember,
    piecesForChanges: order.piecesForChanges,
    paymentMode: order.paymentMode,
    deliveryType: order.deliveryType,
    expiredDate: order.expiredDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    quantity: order.orderDetails && order.orderDetails.length,
    orderDetails: order.orderDetails && order.orderDetails.map(item => OrderDetailShowDTO(item)),
    customer: CustomerListDTO(order.customer),
    deliveryMethod: DeliveryMethodListDTO(order.deliveryMethod),
    user: UserShortDTO(order.user)
});

export const OrderDetailShowDTO = (orderDetail: OrderDetail | any) => ({
    id: orderDetail.id,
    color: orderDetail.color,
    size: orderDetail.size,
    quantity: orderDetail.quantity,
    price: orderDetail.price,
    weight: orderDetail.weight,
    discountPercent: orderDetail.discountPercent,
    product: ProductShortDTO(orderDetail.product),
    productSize: ProductSizeShort(orderDetail.productSize)
});
