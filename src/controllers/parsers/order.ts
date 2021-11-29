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
import {OrderDeliveryListDTO, OrderDeliveryShowDTO} from "./orderDelivery";
import {DeliveryLocalityListDTO} from "./deliveryLocality";


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
        this.deliveryLocality = props.deliveryLocality;
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

    @IsNumber()
    @IsOptional()
    deliveryLocality: number;

    @IsString()
    origen: string;

    products: OrderProduct[]
}

export const OrderUpdateDTO = async (orderRequest: any) => {
    try {
        orderRequest = new OrderUpdate(orderRequest);
        const orderErrors = await validate(orderRequest);
        console.log(orderErrors);
        if(orderErrors.length > 0){
            return orderErrors[0].value;
        }
        return orderRequest;
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
        this.products = props.products;
        this.piecesForChanges = props.piecesForChanges;
        this.paymentMode = props.paymentMode;
        this.deliveryLocality = props.deliveryLocality;
        this.chargeOnDelivery = this.hasChargeOnDelivery(props) || false;

        /** Only for Update */
        this.refreshAddress = props.refreshAddress;
        this.tracking = props.tracking;
        this.enablePostSale = props.enablePostSale;
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

    @IsNumber()
    @IsOptional()
    deliveryLocality: number;

    @IsString()
    @IsOptional()
    origen: string;

    @IsBoolean()
    @IsOptional()
    refreshAddress: boolean;

    @IsString()
    @IsOptional()
    tracking: string;

    @IsBoolean()
    @IsOptional()
    enablePostSale: boolean;

    products: OrderProduct[]
}

export const OrderListDTO = (order: OrderModel) => ({
    id: order ? order.id : null,
    deliveryMethod: DeliveryMethodListDTO(order.deliveryMethod),
    orderDelivery: OrderDeliveryListDTO(order.orderDelivery),
    deliveryLocality: order.orderDelivery && order.orderDelivery.deliveryLocality ? DeliveryLocalityListDTO(order.orderDelivery.deliveryLocality) : null,
    origen: order.origen,
    totalAmount: order.totalAmount,
    subTotalAmount: order.subTotalAmount,
    totalDiscount: order.totalDiscount,
    totalRevenue: order.totalRevenue,
    totalWeight: order.totalWeight,
    remember: order.remember,
    enablePostSale: order.enablePostSale,
    expiredDate: order.expiredDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    quantity: order.quantity,
    customer: CustomerShortDTO(order.customer),
    user: UserShortDTO(order.user),
    office: order.office,
    payment: order.payment
});


export const OrderShowDTO = (order: OrderModel) => ({
    id: order.id,
    deliveryMethod: DeliveryMethodListDTO(order.deliveryMethod),
    orderDelivery: OrderDeliveryShowDTO(order.orderDelivery),
    deliveryLocality: order.orderDelivery && order.orderDelivery.deliveryLocality ? DeliveryLocalityListDTO(order.orderDelivery.deliveryLocality) : null,
    origen: order.origen,
    totalAmount: order.totalAmount,
    subTotalAmount: order.subTotalAmount,
    totalDiscount: order.totalDiscount,
    totalRevenue: order.totalRevenue,
    totalWeight: order.totalWeight,
    remember: order.remember,
    enablePostSale: order.enablePostSale,
    piecesForChanges: order.piecesForChanges,
    paymentMode: order.paymentMode,
    expiredDate: order.expiredDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    quantity: order.quantity,
    orderDetails: order.orderDetails && order.orderDetails.map(item => OrderDetailShowDTO(item)),
    customer: CustomerListDTO(order.customer),
    user: UserShortDTO(order.user),
    office: order.office,
    payment: order.payment
});

export const OrderShortDTO = (order: OrderModel) => ({
    id: order ? order.id : null,
    createdAt: order.createdAt,
    status: order.status
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
    productSize: ProductSizeShort(orderDetail.productSize, orderDetail.quantity)
});
