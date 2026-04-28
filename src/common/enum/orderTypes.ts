import {Order} from "../../models/Order";

export enum OrderTypes {
    INTERRAPIDISIMO = 1,
    MENSAJERO = 2,
    OTRO = 3,
    SERVIENTREGA = 4,
    PAYU = 5,
    DANE = 6
};

const isPayu = (o: Order) => {
    return o.deliveryMethod.id === OrderTypes.PAYU;
}


const isInterrapidisimo = (o: Order) => {
    return o.deliveryMethod.id === OrderTypes.INTERRAPIDISIMO;
}

const isMensajero = (o: Order) => {
    return o.deliveryMethod.id === OrderTypes.MENSAJERO;
}

const isOtro = (o: Order) => {
    return o.deliveryMethod.id === OrderTypes.OTRO;
}

const isServientrega = (o: Order) => {
    return o.deliveryMethod.id === OrderTypes.SERVIENTREGA;
}

const isDane = (o: Order) => {
    return o.deliveryMethod.id === OrderTypes.DANE;
}

export const builderOrderTypes = (o: Order) => {
    return {
        isPayu : () => isPayu(o),
        isInterrapidisimo : () => isInterrapidisimo(o),
        isServientrega : () => isServientrega(o),
        isMensajero : () => isMensajero(o),
        isDane : () => isDane(o),
        isOtro : () => isOtro(o)
    };
}


