import {OrderDelivery} from "../../models/OrderDelivery";

export const OrderDeliveryListDTO = (orderDelivery: OrderDelivery) => ({
    tracking: orderDelivery ? orderDelivery.tracking : null,
    deliveryDate: orderDelivery ? orderDelivery.deliveryDate : null,
    chargeOnDelivery: orderDelivery ? orderDelivery.chargeOnDelivery : null,
    deliveryType:  orderDelivery ? orderDelivery.deliveryType : null
});

export const OrderDeliveryShowDTO = (orderDelivery: OrderDelivery) => ({
    deliveryCost: orderDelivery.deliveryCost,
    deliveryState: orderDelivery.deliveryState,
    deliveryMunicipality: orderDelivery.deliveryMunicipality,
    tracking: orderDelivery.tracking,
    deliveryDate: orderDelivery.deliveryDate,
    chargeOnDelivery: orderDelivery.chargeOnDelivery,
    deliveryType: orderDelivery.deliveryType
});
