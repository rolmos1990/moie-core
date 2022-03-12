export enum DeliveryTypes {
    PREVIOUS_PAYMENT = 1, //Pago por Adelantado
    PAY_ONLY_DELIVERY= 2, //Solo se paga el envio (Producto ya fue pagado) // PREVIO PAGO COD
    CHARGE_ON_DELIVERY = 3 //Cobro en destino
};

export enum DeliveryWebService {
    INTERRAPIDISIMO_SERVICE= 'INTERRAPIDISIMO_WEB'
};

export enum DeliveryLocation {
    INTERRAPIDISIMO = 'INTERRAPIDISIMO'
};

export function getDeliveryType(deliveryType){
    switch(deliveryType) {
        case DeliveryTypes.PREVIOUS_PAYMENT:
            return "PREVIO_PAGO";
        break;
        case DeliveryTypes.PAY_ONLY_DELIVERY:
            return "PAY_ONLY_DELIVERY"; //PREVIOPAGO_COD
        break;
        case DeliveryTypes.CHARGE_ON_DELIVERY:
            return "CHARGE_ON_DELIVERY"; //CONTRAPAGO
        break;
    }
}
