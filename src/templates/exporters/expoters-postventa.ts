import {Order} from "../../models/Order";
import {EXPORTER_POSTVENTA} from "./constants";
import {OrderStatusNames} from '../../common/enum/orderStatus';
import {SingleBaseExporters} from "./single.base.exporters";
import {customerLocality, toDateFormat, toFixed, toFloat, toUpper} from "./utilities";
import {formatPrice} from "../../common/helper/helpers";

export class ExpotersPostventa extends SingleBaseExporters {

    getSheetName(): String {
        return "Worksheet";
    }

    getFileName(){
        return 'Postventa_Delivery.xlsx';
    }

    getBody(data: Order[]) {
        const body = data.map(item => ({
            deliveryDate: toDateFormat(item.orderDelivery.deliveryDate),
            customerName: item.customer ? toUpper(item.customer.name): '',
            orderId: item.id,
            status: OrderStatusNames[item.status].toUpperCase(),
            deliveryMethod: item.deliveryMethod ? toUpper(item.deliveryMethod.name) : '',
            tracking: item.orderDelivery && item.orderDelivery.tracking,
            deliveryStatus: item.orderDelivery ? toUpper(item.orderDelivery.deliveryStatus) : '',
            deliveryDateStatus: item.orderDelivery ? toDateFormat(item.orderDelivery.deliveryStatusDate) : '',
            deliveryState: item.orderDelivery && item.orderDelivery.deliveryCurrentLocality,
            deliveryDestiny: customerLocality(item.customer),
            amount: formatPrice(toFloat(item.totalAmount) + toFloat(item.orderDelivery.deliveryCost)),
            observation: item.comments && item.comments[0] && item.comments[0].comment,
            origen: item.origen,
            phone: item.customer ? item.customer.cellphone : ""
        }));

        return body;
    }

    getHeader() {

        const headers = [
            { header: 'FECHA', key: 'deliveryDate' },
            { header: 'NOMBRE Y APELLIDO', key: 'customerName'},
            { header: 'NRO. PEDIDO', key: 'orderId'},
            { header: 'ESTATUS MOIE', key: 'status'},
            { header: 'METODO ENVIO', key: 'deliveryMethod'},
            { header: 'NRO. GUIA', key: 'tracking'},
            { header: 'ESTATUS ENVIO', key: 'deliveryStatus'},
            { header: 'FECHA ESTATUS ENVIO', key: 'deliveryDateStatus'},
            { header: 'UBICACION ESTATUS ENVIO', key: 'deliveryState'},
            { header: 'DESTINO', key: 'deliveryDestiny'},
            { header: 'MONTO', key: 'amount'},
            { header: 'OBSERVACIONES', key: 'observation'},
            { header: 'ORIGEN DEL PEDIDO', key: 'origen'},
            { header: 'TELEFONO CLIENTE', key: 'phone'}
        ];;
        return headers;
    }

    getName() {
        return EXPORTER_POSTVENTA;
    }

}
