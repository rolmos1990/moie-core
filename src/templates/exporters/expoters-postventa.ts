import {BaseExporters} from "./base.exporters";
import {Order} from "../../models/Order";
import {EXPORTER_POSTVENTA} from "./constants";
import {OrderStatusNames} from '../../common/enum/orderStatus';
import moment = require("moment");
import {SingleBaseExporters} from "./single.base.exporters";
import {toDateFormat, toFixed, toFloat, toUpper} from "./utilities";

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
            customerName: item.customer.name.toUpperCase(),
            orderId: item.id,
            status: OrderStatusNames[item.status].toUpperCase(),
            deliveryMethod: toUpper(item.deliveryMethod.name),
            tracking: item.orderDelivery.tracking,
            deliveryStatus: toUpper(item.orderDelivery.deliveryStatus),
            deliveryDateStatus: moment(item.orderDelivery.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            deliveryState: item.orderDelivery.deliveryState,
            deliveryDestiny: item.customer.state.name + " - " + item.customer.municipality.name,
            amount: toFixed(toFloat(item.totalAmount) + toFloat(item.orderDelivery.deliveryCost)),
            observation: ""
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
            { header: 'OBSERVACIONES', key: 'observation'}
        ];;
        return headers;
    }

    getName() {
        return EXPORTER_POSTVENTA;
    }

}
