import {Order} from "../../models/Order";
import {EXPORTER_OFFICES_MENSAJERO} from "./constants";
import {SingleBaseExporters} from "./single.base.exporters";
import {getPaymentModeLabel, PaymentModes} from "../../common/enum/paymentModes";

export class ExportersOfficeMensajeroCd extends SingleBaseExporters {

    getSheetName(): String {
        return "Worksheet";
    }

    getFileName(){
        return 'Reporte_Despachos.xlsx';
    }

    getBody(data: Order[]) {
        const body = data.map(item => ({
            date: item.dateOfSale,
            order: item.id,
            amount: item.totalAmount,
            paymentMode: getPaymentModeLabel(item.paymentMode),
            piecesForChanges: item.piecesForChanges ? item.piecesForChanges : 0,
            observation: "",
            observationMensajero: ""
        }));

        return body;
    }

    getHeader() {
        const headers = [
            { header: 'Fecha', key: 'date' },
            { header: '# Pedido', key: 'order'},
            { header: 'Monto', key: 'amount'},
            { header: 'Forma de pago', key: 'paymentMode'},
            { header: 'Prendas para cambio', key: 'piecesForChanges'},
            { header: 'Observación Lucymodas', key: 'observation'},
            { header: 'Observación Mensajero', key: 'observationMensajero'}
        ];;
        return headers;
    }

    getName() {
        return EXPORTER_OFFICES_MENSAJERO;
    }

}
