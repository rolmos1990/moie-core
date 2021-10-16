import {EXPORTER_ELECTRONIC_BILL, EXPORTER_POSTVENTA} from "./constants";
import {ElectronicBillAdaptor} from "../adaptors/ElectronicBillAdaptor";
import {MultisheetBaseExporters} from "./multisheet.base.exporters";
import moment = require("moment");
import {IColumn} from "../../common/interfaces/IColumns";
import {EBillType} from "../../common/enum/eBill";

export class ExpotersEletronicBill extends MultisheetBaseExporters {

    private type: EBillType;

    defineHeaders() : IColumn[][] {

        const headers = [];

        /** Facturas */
        headers.push([
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
            { header: 'Detalles', key: 'details'}
        ]);

        /** NIT */
        headers.push([
        { header: 'Nit', key: 'nit' },
        { header: 'Tipo', key: 'type'},
        { header: 'Nombre', key: 'name'},
        { header: 'Direccion', key: 'address'},
        { header: 'Ciudad', key: 'city'},
        { header: 'Telefono', key: 'phone'},
        { header: 'Municipio', key: 'municipality'},
        { header: 'Activo', key: 'active'},
        { header: 'Tiene RUT', key: 'hasRoot'},
        { header: 'Pais', key: 'country'},
        { header: 'Email', key: 'email'},
        { header: 'Celular', key: 'cellphone'},
        { header: 'Plazo', key: 'plazo'},
        { header: 'Actividad Económica', key: 'actividadEconomica'},
        { header: 'Indicativo', key: 'indicativo'},
        { header: 'Naturaleza', key: 'naturaleza'}
        ]);

        return headers;
    }

    defineSheetName(): String[] {
        return ["Facturas", "Nit"];
    }

    setType(type: EBillType){
        this.type = type;
    }

    getFileName(){

        let name = 'facturas_electronicas_';

        if(this.type === EBillType.CREDIT){
            name = 'notas_credito_';
        }
        return name + moment().format("YYYY-MM-DD-H-mm") +'.xlsx';
    }

    getBody(billAdaptor: ElectronicBillAdaptor) {

        let report1 = [];
        let report2 = [];

        const getFormat = (bill, account, type, value, base) => {
            let result;
            try {
                result = {
                    account: account,
                    checker: '00004', //Comprobante
                    date: bill.createdAt,
                    document: bill.billConfig.prefix + bill.legalNumber,
                    documentRef: bill.billConfig.prefix + bill.legalNumber,
                    nit: bill.order.customer.document || '222222222',
                    detail: bill.order.customer.municipality.name,
                    type: type,
                    value: value ? value : "",
                    base: base ? base : "",
                    costCenter: 1001,
                    transExt: '',
                    term: 0,
                    details: `Pedido # ${bill.order.id}`
                };
            }catch(e){
                console.log("error generando", e.message);
            }

            return result;
        }

        if(this.getCurentIterator() === 0){

            /** Registro de Facturas */
            billAdaptor.getData().bills.map(bill => {

                const montoTotal = bill.monto_con_iva + bill.flete

                report1.push(getFormat(bill, '41352401', 2, bill.monto_sin_iva, 0));
                report1.push(getFormat(bill, '24080501', 2, bill.monto_iva, bill.monto_sin_iva));
                report1.push(getFormat(bill, '424540', 2, bill.flete, 0));
                report1.push(getFormat(bill, '13050501', 1,montoTotal, 0));
            });

            return report1;
        }

        if(this.getCurentIterator() === 1) {

            /** Registro de clientes */
            billAdaptor.getData().customers.map(customer => {
                report2.push({
                    nit: customer.document || '222222222',
                    type: 'C',
                    name: customer.name + '',
                    address: (customer.address) ? (customer.address + '') : '',
                    city: customer.municipality ? customer.municipality.name : '',
                    phone: (customer.phone + "") || '',
                    municipality: '',
                    active: 'S',
                    hasRoot: 'N',
                    country: '169',
                    email: customer.email || '',
                    cellphone: (customer.cellphone + '') || '',
                    plazo: '0',
                    actividadEconomica: '',
                    indicativo: '',
                    naturaleza: 'N'
                });
            });

            return report2;
        }
    }

    getName() {
        return EXPORTER_ELECTRONIC_BILL;
    }

}
