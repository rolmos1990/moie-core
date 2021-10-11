import {BaseExporters} from "./base.exporters";
import {EXPORTER_POSTVENTA} from "./constants";
import {ElectronicBillAdaptor} from "../adaptors/ElectronicBillAdaptor";

export class ExpotersEletronicBill extends BaseExporters {

    getSheetName(): String {
        return "Worksheet";
    }

    getFileName(){
        return 'Facturacion_Electronica.xlsx';
    }

    getBody(billAdaptor: ElectronicBillAdaptor) {

        let report = [];

        const getFormat = (bill, account, type, value, base) => {
            let result;
            try {
                result = {
                    account: account,
                    checker: '00004', //Comprobante
                    date: bill.createdAt,
                    document: bill.billConfig.prefix + bill.legalNumber,
                    documentRef: bill.billConfig.prefix + bill.legalNumber,
                    nit: bill.order.customer.document,
                    detail: bill.order.customer.municipality.name,
                    type: type,
                    value: value,
                    base: base,
                    costCenter: 1001,
                    transExt: '',
                    term: 0,
                    details: "Pedido #" + bill.id
                };
            }catch(e){
                console.log("error generando", e.message);
            }

            return result;
        }

        billAdaptor.getData().bills.map(bill => {
            report.push(getFormat(bill, '41352401', 2, bill.monto_sin_iva, 0));
            report.push(getFormat(bill, '24080501', 2, bill.monto_iva, bill.monto_sin_iva));
            report.push(getFormat(bill, '424540', 2, bill.flete, 0));
            report.push(getFormat(bill, '13050501', 1, bill.monto_con_iva + bill.flete, 0));
        });

        return report;
    }

    getHeader() {

        const headers = [
            { header: 'Cuenta', key: 'account' },
            { header: 'Comprobante', key: 'checker'},
            { header: 'Fecha (mm/dd/yyyy)', key: 'date'},
            { header: 'Documento', key: 'document'},
            { header: 'Documento Ref.', key: 'documentRef'},
            { header: 'Nit', key: 'nit'},
            { header: 'Detalle', key: 'detail'},
            { header: 'Tipo', key: 'type'},
            { header: 'Valor', key: 'value'},
            { header: 'Base', key: 'base'},
            { header: 'Centro de Costo', key: 'costCenter'},
            { header: 'Trans. Ext', key: 'transExt'},
            { header: 'Plazo', key: 'terms'},
            { header: 'Detalles', key: 'term'}
        ];;
        return headers;
    }

    getName() {
        return EXPORTER_POSTVENTA;
    }

}
