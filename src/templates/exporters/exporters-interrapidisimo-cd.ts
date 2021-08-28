import {BaseExporters} from "./base.exporters";
import {Order} from "../../models/Order";
import {EXPORTER_INTERRAPIDISIMO_CD} from "./constants";

export class ExportersInterrapidisimoCd extends BaseExporters {

    getSheetName(): String {
        return "Worksheet";
    }

    getFileName(){
        return 'Interrapidisimo_Contrapago.xlsx';
    }

    getBody(data: Order[]) {
        console.log("DEBUG -- DATA INFO", JSON.stringify(data[0]));
        const body = data.map(item => ({
           id: item.customer.document,
           name: item.customer.name.toUpperCase(),
           phone: item.customer.phone,
           phone2: item.customer.cellphone,
           address: item.customer.temporalAddress || "", //TODO -- agregar direccion real del cliente
           cityCode: "54553000", //item.orderDelivery.deliveryLocality.deliveryAreaCode, //TODO -- reasignar aqui la localidad de interrapidisimo
           city: item.customer.municipality.name.toUpperCase(),
           description: 'PRENDAS DE VESTIR - ' + item.id,
           weight: item.totalWeight < 1000 ? 1000 : Math.floor(item.totalWeight / 1000) ,
           price:item.totalAmount.toFixed(2),
           number: item.id
        }));

        console.log("DEBUG -- TO SAVE", JSON.stringify(body));

        return body;
    }

    getHeader() {
        const headers = [
            { header: 'NUMERO GUIA', key: 'guia' },
            { header: 'ID DESTINATARIO', key: 'id'},
            { header: 'NOMBRE DESTINATARIO', key: 'name'},
            { header: 'APELLIDO1 DESTINATARIO', key: 'lastname'},
            { header: 'APELLIDO2 DESTINATARIO', key: 'lastname2'},
            { header: 'TELEFONO DESTINATARIO', key: 'phone'},
            { header: 'TELEFONO DESTINATARIO 2', key: 'phone2'},
            { header: 'DIRECCION DESTINATARIO', key: 'address'},
            { header: 'CODIGO CIUDAD DESTINO', key: 'cityCode'},
            { header: 'CIUDAD DESTINO', key: 'city'},
            { header: 'DICE CONTENER', key: 'description'},
            { header: 'OBSERVACIONES', key: 'observation'},
            { header: 'BOLSA DE SEGURIDAD', key: 'security'},
            { header: 'PESO', key: 'weight'},
            { header: 'VALOR COMERCIAL', key: 'price'},
            { header: 'NO PEDIDO', key: 'number'},
            { header: 'DIRECCION AGENCIA DESTINO', key: 'addressAgency'},
            { header: 'FOLIO', key: 'folio'},
            { header: 'CODIGO RADICADO', key: 'code'},
        ];;
        return headers;
    }

    getName() {
        return EXPORTER_INTERRAPIDISIMO_CD;
    }

}
