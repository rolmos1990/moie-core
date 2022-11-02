import {IsBoolean, IsNumber, IsOptional, IsString, validate} from "class-validator";
import {OrderProduct} from "./orderProduct";
import {InvalidArgumentException} from "../../common/exceptions";
import {Order as OrderModel} from '../../models/Order';
import {DeliveryMethodListDTO, DeliveryMethodShortListDTO} from "./deliveryMethod";
import {CustomerListDTO, CustomerListShortDTO, CustomerShortDTO} from "./customer";
import {DeliveryEnum} from "../../models/DeliveryMethod";
import {UserShortDTO} from "./user";
import {OrderDetail} from "../../models/OrderDetail";
import {ProductShortDTO} from "./product";
import {ProductSizeShort} from "./productSize";
import {OrderDeliveryListDTO, OrderDeliveryShortListDTO, OrderDeliveryShowDTO} from "./orderDelivery";
import {DeliveryLocalityListDTO, DeliveryLocalityListShortDTO} from "./deliveryLocality";
import {isPaymentMode} from "../../common/enum/paymentModes";


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
        this.chargeOnDelivery = this.isChargeOnDelivery();
        this.prints = props.prints;
        this.photos = props.photos;
        this.otherMethod = props.otherMethod;

    }

    isChargeOnDelivery() : boolean {
        return this.deliveryType === DeliveryEnum.CHARGE_ON_DELIVERY ? true: false;
    }

    hasPaymentMode(){
        const isPayment = this.paymentMode && isPaymentMode(this.paymentMode);
        return isPayment;
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

    @IsNumber()
    @IsOptional()
    prints: number;

    @IsNumber()
    @IsOptional()
    photos: number;

    @IsString()
    @IsOptional()
    tracking: string;

    @IsString()
    @IsOptional()
    otherMethod: string;

    products: OrderProduct[]
}

export const OrderUpdateDTO = async (orderRequest: any) => {
    try {
        orderRequest = new OrderUpdate(orderRequest);
        const orderErrors = await validate(orderRequest);
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
        this.chargeOnDelivery = this.isChargeOnDelivery() || false;

        /** Only for Update */
        this.refreshAddress = props.refreshAddress;
        this.tracking = props.tracking;
        this.prints = props.prints;
        this.photos = props.photos;
        this.otherMethod = props.otherMethod;
    }

    isChargeOnDelivery() : boolean {
        return this.deliveryType === DeliveryEnum.CHARGE_ON_DELIVERY;
    }

    hasPaymentMode(){
       const isPayment = this.paymentMode && isPaymentMode(this.paymentMode);
       return isPayment;
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
    products: OrderProduct[]

    @IsNumber()
    @IsOptional()
    prints: number;

    @IsNumber()
    @IsOptional()
    photos: number;

    @IsString()
    @IsOptional()
    otherMethod: string;
}

export const OrderListDTO = (order: OrderModel) => ({
    id: order ? order.id : null,
    deliveryMethod: order ? DeliveryMethodListDTO(order.deliveryMethod) : null,
    orderDelivery: order ? OrderDeliveryListDTO(order.orderDelivery) : null,
    deliveryLocality: order.orderDelivery && order.orderDelivery.deliveryLocality ? DeliveryLocalityListDTO(order.orderDelivery.deliveryLocality) : null,
    origen: order.origen,
    totalAmount: order.totalAmount,
    dateOfSale: order.dateOfSale,
    totalWithDiscount: order.totalWithDiscount,
    subTotalAmount: order.subTotalAmount,
    totalDiscount: order.totalDiscount,
    totalRevenue: order.totalRevenue,
    totalWeight: order.totalWeight,
    remember: order.remember,
    expiredDate: order.expiredDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    quantity: order.quantity,
    customer: order ? CustomerShortDTO(order.customer) : null,
    user: order ? UserShortDTO(order.user) : null,
    office: order.office,
    payment: order.payment,
    bill: order.bill,
    postSaleDate: order.postSaleDate,
    manualReceived: order.manualReceived
});

export const OrderListShortDTO = (order: OrderModel) => ({
    id: order ? order.id : null,
    deliveryMethod: order ? DeliveryMethodShortListDTO(order.deliveryMethod) : null,
    orderDelivery: order ? OrderDeliveryShortListDTO(order.orderDelivery) : null,
    deliveryLocality: order.orderDelivery && order.orderDelivery.deliveryLocality ? DeliveryLocalityListShortDTO(order.orderDelivery.deliveryLocality) : null,
    totalAmount: order.totalAmount,
    totalWithDiscount: order.totalWithDiscount,
    createdAt: order.createdAt,
    status: order.status,
    quantity: order.quantity,
    customer: order ? CustomerListShortDTO(order.customer) : null,
    user: order ? UserShortDTO(order.user) : null
});


export const OrderShowDTO = (order: OrderModel) => ({
    id: order.id,
    deliveryMethod: order ? DeliveryMethodListDTO(order.deliveryMethod) : null,
    orderDelivery: order ? OrderDeliveryShowDTO(order.orderDelivery) : null,
    deliveryLocality: order.orderDelivery && order.orderDelivery.deliveryLocality ? DeliveryLocalityListDTO(order.orderDelivery.deliveryLocality) : null,
    origen: order.origen,
    totalAmount: order.totalAmount,
    dateOfSale: order.dateOfSale,
    totalWithDiscount: order.totalWithDiscount,
    subTotalAmount: order.subTotalAmount,
    totalDiscount: order.totalDiscount,
    totalRevenue: order.totalRevenue,
    totalWeight: order.totalWeight,
    remember: order.remember,
    piecesForChanges: order.piecesForChanges,
    paymentMode: order.paymentMode,
    expiredDate: order.expiredDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    quantity: order.quantity,
    orderDetails: order.orderDetails && order.orderDetails.map(item => OrderDetailShowDTO(item)),
    customer: order ? CustomerListDTO(order.customer) : null,
    user: order ? UserShortDTO(order.user) : null,
    office: order.office,
    payment: order.payment,
    prints: order.prints || 0,
    photos: order.photos  || 0,
    bill: order.bill,
    manualReceived: order.manualReceived
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
    product: orderDetail ? ProductShortDTO(orderDetail.product) : null,
    productSize: orderDetail ? ProductSizeShort(orderDetail.productSize, orderDetail.quantity) : null
});


export const OrderPaymentShowDTO = (order: Order | any) => ({
    id: order.id,
    status: order.status,
    customer: order ? CustomerListDTO(order.customer) : null,
    createdAt: order.createdAt,
    quantity: order.quantity,
    totalAmount: order.totalAmount,
    totalWithDiscount: order.totalWithDiscount,
    subTotalAmount: order.subTotalAmount,
    orderDelivery: order ? OrderDeliveryListDTO(order.orderDelivery) : null
});
