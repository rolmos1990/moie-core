import {BaseExporters} from "./base.exporters";
import {Order} from "../../models/Order";
import {EXPORTER_INTERRAPIDISIMO_CD} from "./constants";
import {SingleBaseExporters} from "./single.base.exporters";

export class ExportersInterrapidisimoCd extends SingleBaseExporters {

    getSheetName(): String {
        return "Worksheet";
    }

    getFileName(){
        return 'Interrapidisimo_Contrapago.xlsx';
    }

    getConverter(weight){
        if(parseFloat(weight) < 1000){
            return 1;
        } else {
            return (Math.floor(Number(weight) / 1000));
        }

    }

    formatNumber(_number){
        if(!_number){
            return !_number;
        }
        return _number.toString().replace('.',',');
    }

    getBody(data: Order[]) {

        const preFormat = (item, objects) => {

            let name = "";
            let lastname = "";
            if(item.customer && item.customer.name) {

                const _fullname = item.customer.name;

                const index = _fullname.indexOf(" ");
                const firstname = _fullname.substr(0, index);
                const secondname = _fullname.substr(index + 1);

                name = firstname;
                lastname = secondname;
            }

            return {...objects, name, lastname};
        }

        const body = data.map(item => preFormat(item, {
           id: item.customer.document,
           name: '',
           lastname: '',
           phone: item.customer.cellphone,
           phone2: item.customer.phone,
           address: item.customer.address || "",
           cityCode: item.orderDelivery && item.orderDelivery.deliveryLocality && item.orderDelivery.deliveryLocality.deliveryAreaCode,
           city: item.customer.municipality.name.toUpperCase(),
           description: 'PRENDAS DE VESTIR - ' + item.id,
           weight: this.getConverter(item.totalWeight),
           price: this.formatNumber(item.totalAmount),
           number: item.id
        }));

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
