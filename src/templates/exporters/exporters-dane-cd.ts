import {BaseExporters} from "./base.exporters";
import {Order} from "../../models/Order";
import {EXPORTER_DANE_CD} from "./constants";
import {SingleBaseExporters} from "./single.base.exporters";
import {formatPrice} from "../../common/helper/helpers";
import {toUpper} from "./utilities";
import { DeliveryEnum } from "../../models/DeliveryMethod";

export class ExportersDaneCd extends SingleBaseExporters {

    getSheetName(): String {
        return "Worksheet";
    }

    getFileName(){
        return 'Dane_Contrapago.xlsx';
    }

    getConverter(weight){
        if(parseFloat(weight) < 1000){
            return 1;
        } else {
            return (Math.floor(Number(weight) / 1000));
        }

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

                name = toUpper(firstname);
                lastname = toUpper(secondname);
            }

            return {...objects, name, lastname};
        }

        const cleanPhone = (value) => value?.replace(/\s|-/g, '')   // opcional: limpia espacios y guiones
                                            .replace(/^\+57/, '');   // quita +57 solo si está al inicio

        const body = data.map(item => preFormat(item, {
           id: item.customer && item.customer.document,
           email: item.customer && item.customer.email,
           identificacionComprador: '',
           document : item.customer && item.customer.document,
           nombres: item.customer && item.customer.name,
           apellidos: item.customer && item.customer.name,
           //phone: (item.customer && item.customer.cellphone) ? cleanPhone(item.customer?.cellphone) : cleanPhone(item.customer?.phone),
           address: item.customer.address || "",
           cityCode: item.orderDelivery && item.orderDelivery.deliveryLocality && item.orderDelivery.deliveryLocality.deliveryAreaCode,
           departamento: '',
           description: 'PRENDAS DE VESTIR - ' + item.id,
           attribute1: '',
           attribute2: '',
           attribute3: '',
           quantity: 1,
           price: Math.trunc(item.totalAmount),
           deliveryIncluded: 'SI',
           height: '7',
           width: '26,50',
           length: '41',
           weight: this.getConverter(item.totalWeight),
           paymentMode: item.orderDelivery.deliveryType == DeliveryEnum.CHARGE_ON_DELIVERY ? 'PCE' : 'PE'
        }));

        return body;
    }
 
getHeader() {
    const headers = [
        { header: 'numero_pedido', key: 'id' },
        { header: 'correo_electronico_opcional', key: 'email' },
        { header: 'tipo_identificacion_comprador_opcional', key: 'identificacionComprador' },
        { header: 'numero_identificacion_comprador_opcional', key: 'document' },
        { header: 'nombres_comprador', key: 'name' },
        { header: 'apellidos_comprador', key: 'lastname' },
        //{ header: 'telefono_comprador', key: 'phone' },
        { header: 'direccion_entrega', key: 'address' },
        { header: 'ciudad_entrega', key: 'cityCode' },
        { header: 'departamento_entrega', key: 'departamento' },
        { header: 'nombre_producto', key: 'description' },
        { header: 'atributo_1', key: 'attribute1' },
        { header: 'atributo_2', key: 'attribute2' },
        { header: 'atributo_3', key: 'attribute3' },
        { header: 'cantidad', key: 'quantity' },
        { header: 'precio_unitario', key: 'price' },
        { header: 'envio_incluido', key: 'deliveryIncluded' },
        { header: 'alto', key: 'height' },
        { header: 'ancho', key: 'width' },
        { header: 'largo', key: 'length' },
        { header: 'peso_kg', key: 'weight' },
        { header: 'forma_pago', key: 'paymentMode' }
    ];

    return headers;
}

    getName() {
        return EXPORTER_DANE_CD;
    }

}
