import {ProductOrderCreate} from "./productSize";

export const OrderCreateDTO = (order: any) => ({
    chargeOnDelivery: order.chargeOnDelivery,
    customer: order.customer,
    deliveryCost: order.deliveryCost,
    deliveryMethod: order.deliveryMethod,
    deliveryType: order.deliveryType,
    origen: order.origen,
    pieces: order.pieces,
    products: order.products && order.products.map(item => ProductOrderCreate(item))
});
