import {DeliveryTypes} from "./deliveryTypes";
import {OrderDelivery} from "../../models/OrderDelivery";

export enum PaymentModes {
    CASH = 1, //PAGO EN EFECTIVO
    WIRETRANSFER= 2, //TRANSFERENCIA BANCARIA
};

export const isPaymentMode = (paymentMode) => {
    return [PaymentModes.CASH,PaymentModes.WIRETRANSFER].includes(paymentMode);
}

export const isCash = (paymentMode) => {
    if(!paymentMode){
        return false;
    }
    if(paymentMode == PaymentModes.CASH){
        return true;
    }
    return false;
}

export const isChargeOnDelivery = (orderDelivery: OrderDelivery) => {
    return (orderDelivery.deliveryType === DeliveryTypes.CHARGE_ON_DELIVERY) ? true : false;
}

export const getPaymentModeLabel = (paymentId) => {
    if(paymentId === PaymentModes.CASH){
        return "EFECTIVO";
    }
    if(paymentId === PaymentModes.WIRETRANSFER){
        return "TRANSFERENCIA";
    }
     return "";
}
