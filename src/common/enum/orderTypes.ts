import {Order} from "../../models/Order";

export enum OrderTypes {
    INTERRAPIDISIMO = 1,
    MENSAJERO = 2,
    OTRO = 3,
};

const isInterrapidisimo = (o: Order) => {
    return o.deliveryMethod.id === OrderTypes.INTERRAPIDISIMO;
}

const isMensajero = (o: Order) => {
    return o.deliveryMethod.id === OrderTypes.MENSAJERO;
}

const isOtro = (o: Order) => {
    return o.deliveryMethod.id === OrderTypes.OTRO;
}

export const builderOrderTypes = (o: Order) => {
    return {
        isInterrapidisimo : () => isInterrapidisimo(o),
        isMensajero : () => isMensajero(o),
        isOtro : () => isOtro(o)
    };
}


