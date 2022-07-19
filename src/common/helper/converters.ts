import {Order} from "../../models_moie/Order";
import {OrderDelivery} from "../../models/OrderDelivery";
import {BillCreditMemo} from "../../models_moie/BillCreditMemo";
import {Bill} from "../../models_moie/Bill";

const PREVIOUS_PAYMENT = "PREVIO PAGO";
const PREVIOUS_PAYMENT_COD = "PREVIO PAGO COD";
const CHARGE_ON_DELIVERY = "CONTRA ENTREGA";

const STATUS = {
    PENDING: 1,
    CONCILIED: 2,
    PRINT: 3,
    SENT: 4,
    CONFIRMED: 5,
    FINISHED: 7,
    CANCELED: 6
};

const _deliveryTypeConverter = (type) => {
    if(type === PREVIOUS_PAYMENT){
        return 1;
    }
    if(type === PREVIOUS_PAYMENT_COD){
        return 2;
    }
    if(type === PREVIOUS_PAYMENT){
        return 3;
    }

    return 1;
}

const _statusConverter = (order: Order) => {
    const isPrevioPago = [PREVIOUS_PAYMENT, PREVIOUS_PAYMENT_COD].includes(order.deliveryType);

    //PENDIENTES
    if(order.status == 'PENDIENTE'){
        return STATUS.PENDING;
    }

    //CONCILIADOS
    if(isPrevioPago && order.status == 'VENDIDO'){
        return STATUS.CONCILIED;
    }

    //IMPRESAS
    if(order.status === 'IMPRESA'){
        return STATUS.PRINT;
    }

    //ENVIADO
    if((order.status === 'ENVIADO' && isPrevioPago) || (order.dateOfSale != null && order.status == 'ENVIADO')){
        return STATUS.FINISHED;
    }

    //CONFIRMADA
    if(order.status === 'VENDIDO' && !isPrevioPago){
        return STATUS.CONFIRMED;
    }

    if(order.status === 'ANULADO'){
        return STATUS.CANCELED;
    }

    return -1;

}

const DELIVERY_METHOD = {
    INTERRAPIDISIMO: 1,
    MENSAJERO: 2,
    OTRO: 3,
    SERVIENTREGA: 4,
    PAYU: 5,
};

const _officeStatusConverter_single = (_status) => {

    if(_status == 'FINALIZADO'){
        return 2;
    }

    return 1;
}

const _deliveryMethodConverter_single = (methodName) => {

    if(methodName == null || methodName == ''){
        return DELIVERY_METHOD.OTRO;
    }

    return DELIVERY_METHOD[methodName];
}

const _deliveryMethodConverter = (order: Order) => {

    if(order.deliveryMethod == null || order.deliveryMethod == ''){
        return DELIVERY_METHOD.OTRO;
    }

    return DELIVERY_METHOD[order.deliveryMethod];

}

const _orderDeliveryConverter = (order: Order) : OrderDelivery => {
    const municipality = order.customer ? order.customer.municipality : null;
    const _orderDelivery = new OrderDelivery();

    _orderDelivery.deliveryCost = order.deliveryAmount;
    _orderDelivery.deliveryLocality = order.deliveryLocality;
    _orderDelivery.chargeOnDelivery = (order.deliveryType === CHARGE_ON_DELIVERY) ? true : false;
    _orderDelivery.deliveryMunicipality = municipality ? municipality.name : '';
    _orderDelivery.deliveryState = order.customer ? order.customer.state : null;
    _orderDelivery.tracking = order.trackingNumber;
    _orderDelivery.sync = false;

    _orderDelivery.deliveryDate = null;
    _orderDelivery.deliveryCurrentLocality = null;
    _orderDelivery.order = order ? order.id : null;

    if(order.postSale[0]) {
        //order.postSale[0].payu
        _orderDelivery.deliveryCurrentLocality = order.postSale[0].deliveryCurrentLocality;
        _orderDelivery.deliveryDate = order.postSale[0].deliveryDate;
        _orderDelivery.deliveryStatus = order.postSale[0].deliveryStatus;
        _orderDelivery.tracking = order.postSale[0].tracking;
        _orderDelivery.deliveryStatusDate = order.postSale[0].deliveryStatusDate;
        _orderDelivery.sync = order.postSale[0].sync;
    }


    return _orderDelivery;
}

const HISTORIC_STATUS = {
    registrar: 1,
    actualizar: 8,
    imprimir: 3,
    confirmar: 2,
    anular: 6,
    'confirmar envio': 4,
    vendido: 7
};

const _orderHistoricStatus_single = (_historicStatus) => {

    if(_historicStatus == null || _historicStatus == ''){
        return HISTORIC_STATUS.registrar;
    }

    return HISTORIC_STATUS[_historicStatus];
}


const _creditMemoStatus = (creditMemo: BillCreditMemo) => {
    if(creditMemo.trackId === ''){
        return false;
    } else {
        return true;
    }
}

const _billStatus = (bill: Bill) => {
    if(bill.trackId === ''){
        return 'Pendiente';
    } else {
        return bill.trackId;
    }
}


export const converters = {
    _deliveryTypeConverter,
    _statusConverter,
    _deliveryMethodConverter_single,
    _deliveryMethodConverter,
    _officeStatusConverter_single,
    _orderDeliveryConverter,
    _orderHistoricStatus_single,
    _creditMemoStatus,
    _billStatus
};
