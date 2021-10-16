import {Order} from "../../models/Order";
import {EXPORTER_POSTVENTA} from "./constants";
import moment = require("moment");
import {SingleBaseExporters} from "./single.base.exporters";

export class ExportersConciliates extends SingleBaseExporters {

    getSheetName(): String {
        return "Conciliados";
    }

    getFileName(){
        return 'Conciliados.xlsx';
    }

    getBody(data: Order[]) {
        const body = data.map(item => ({
            id: item.id,
            dateOfSale: moment(item.dateOfSale).format("DD-MM-YYYY"),
            deliveryMethod: item.deliveryMethod.name,
            amount: item.totalAmount + item.orderDelivery.deliveryCost,
            document: item.customer.document
        }));

        return body;
    }

    getHeader() {
        const headers = [
            { header: '# Pedido', key: 'id' },
            { header: 'Fecha venta', key: 'dateOfSale'},
            { header: 'Metodo Envío', key: 'deliveryMethod'},
            { header: 'Monto', key: 'amount'},
            { header: 'CC / NIT', key: 'document'}
        ];;
        return headers;
    }

    getName() {
        return EXPORTER_POSTVENTA;
    }

}
