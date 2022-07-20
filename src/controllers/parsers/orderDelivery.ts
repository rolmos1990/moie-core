import {OrderDelivery} from "../../models/OrderDelivery";
import {DeliveryLocalityListDTO} from "./deliveryLocality";

export const OrderDeliveryListDTO = (orderDelivery: OrderDelivery) => ({
    tracking: orderDelivery ? orderDelivery.tracking : null,
    deliveryDate: orderDelivery ? orderDelivery.deliveryDate : null,
    chargeOnDelivery: orderDelivery ? orderDelivery.chargeOnDelivery : null,
    deliveryCost: orderDelivery ? orderDelivery.deliveryCost : 0,
    deliveryType:  orderDelivery ? orderDelivery.deliveryType : null,
    deliveryStatus: orderDelivery ? orderDelivery.deliveryStatus : null,
    deliveryLocality: orderDelivery ? DeliveryLocalityListDTO(orderDelivery.deliveryLocality) : null
});

export const OrderDeliveryShortListDTO = (orderDelivery: OrderDelivery) => ({
    chargeOnDelivery: orderDelivery ? orderDelivery.chargeOnDelivery : null,
    deliveryType:  orderDelivery ? orderDelivery.deliveryType : null
});

export const OrderDeliveryShowDTO = (orderDelivery: OrderDelivery) => ({
    deliveryCost: orderDelivery ? orderDelivery.deliveryCost : null,
    deliveryState: orderDelivery ? orderDelivery.deliveryState : null,
    deliveryMunicipality: orderDelivery ? orderDelivery.deliveryMunicipality : null,
    tracking: orderDelivery ? orderDelivery.tracking : null,
    deliveryDate: orderDelivery ? orderDelivery.deliveryDate : null,
    chargeOnDelivery: orderDelivery ? orderDelivery.chargeOnDelivery : null,
    deliveryType: orderDelivery ? orderDelivery.deliveryType : null,
    deliveryStatus: orderDelivery ? orderDelivery.deliveryStatus : null,
    deliveryLocality: orderDelivery ? DeliveryLocalityListDTO(orderDelivery.deliveryLocality) : null,
    deliveryCurrentLocality: orderDelivery ? orderDelivery.deliveryCurrentLocality : null,
    deliveryStatusDate: orderDelivery ? orderDelivery.deliveryStatusDate : null,
    sync: orderDelivery ? orderDelivery.sync : false
});
