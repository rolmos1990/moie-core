import {Order} from "../../models/Order";
import {EXPORTER_OFFICES} from "./constants";
import {SingleBaseExporters} from "./single.base.exporters";
import {toDateFormat} from "./utilities";
import {formatPrice} from "../../common/helper/helpers";

export class ExportersOfficeCd extends SingleBaseExporters {

    getSheetName(): String {
        return "Worksheet";
    }

    getFileName(){
        return 'Reporte_Despachos.xlsx';
    }

    getBody(data: Order[]) {
        const body = data.map(item => ({
            date: toDateFormat(item.office.batchDate),
            order: item.id,
            amount: formatPrice(item.totalAmount)
        }));

        console.log(body);

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
