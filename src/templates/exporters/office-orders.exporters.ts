import {Order} from "../../models/Order";
import {EXPORTER_OFFICES} from "./constants";
import {SingleBaseExporters} from "./single.base.exporters";

export class ExportersOfficeCd extends SingleBaseExporters {

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
            amount: item.totalAmount
        }));

        return body;
    }

    getHeader() {
        const headers = [
            { header: 'Fecha', key: 'date' },
            { header: '# Pedido', key: 'order'},
            { header: 'Monto', key: 'amount'}
        ];;
        return headers;
    }

    getName() {
        return EXPORTER_OFFICES;
    }

}
