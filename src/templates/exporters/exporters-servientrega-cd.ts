import {BaseExporters} from "./base.exporters";
import {Order} from "../../models/Order";
import {EXPORTER_INTERRAPIDISIMO_CD, EXPORTER_SERVIENTREGA_CD} from "./constants";
import {SingleBaseExporters} from "./single.base.exporters";
import {formatPrice} from "../../common/helper/helpers";
import {toUpper} from "./utilities";
import {DeliveryLocality} from "../../models/DeliveryLocality";

export class ExportersServientregaCd extends SingleBaseExporters {

    getSheetName(): String {
        return "Envios";
    }

    getFileName(){
        return 'Servientrega_Contrapago.xlsx';
    }

    getConverter(weight){
        if(parseFloat(weight) < 1000){
            return 1;
        } else {
            return (Math.floor(Number(weight) / 1000));
        }

    }

    getLocality(deliveryLocality : DeliveryLocality) {
        if(deliveryLocality && deliveryLocality.name){
            const _name = deliveryLocality.name.split('/');
            return {city: _name[1], state: _name[0]};
        }
        return {city: '', state: ''};
    }

    getBody(data: Order[]) {

        const body = data.map(item => ({
           customer: item.customer && item.customer.document,
           name: item.customer && item.customer.name,
           address: item.customer.address || "",
           city: item.orderDelivery && this.getLocality(item.orderDelivery.deliveryLocality).city,
           state: item.orderDelivery && this.getLocality(item.orderDelivery.deliveryLocality).state,
           phone: item.customer && item.customer.cellphone,
           number: 'Prendas de vestir -' + item.id,
           price: Math.round(item.totalAmount),
           weight: 3, //this.getConverter(item.totalWeight),

           alto: 30,
           ancho: 20,
           largo: 20,
           idProducto: 2,
           tipoDuracionTrayecto: 1,
           formaPago: 2,
           unidadLongitud:'CM',
           unidadPeso: 'KG',
           piezas: 1, //item.quantity,
           tipoDocumento: 2,
           medioTransporte: 1,
           unidadEmpaque: 'GENERICA',
           numValorDeclarado: Math.round(item.totalAmount),
           guia: '',
           estado: 1,
        }));

        return body;
    }

    getHeader() {
        const headers = [
            { header: 'Ide_Num_Identific_Dest', key: 'customer' },
            { header: 'Nom_Contacto', key: 'name' },
            { header: 'Des_Direccion', key: 'address' },
            { header: 'Des_Ciudad', key: 'city' },
            { header: 'Des_Departamento', key: 'state' },
            { header: 'Des_Telefono', key: 'phone' },
            { header: 'Des_DiceContener', key: 'number' },
            { header: 'Valor a cobrar por el Producto', key: 'price' },
            { header: 'Num_Alto', key: 'alto' },
            { header: 'Num_Ancho', key: 'ancho' },
            { header: 'Num_Largo', key: 'largo' },
            { header: 'Num_Peso', key: 'weight' },

            { header: 'Ide_Producto', key: 'idProducto' },
            { header: 'Des_TipoDuracionTrayecto', key: 'tipoDuracionTrayecto' },
            { header: 'Des_FormaPago', key: 'formaPago' },
            { header: 'Des_UnidadLongitud', key: 'unidadLongitud' },
            { header: 'Des_UnidadPeso', key: 'unidadPeso' },
            { header: 'Num_Piezas', key: 'piezas' },
            { header: 'Tipo_Documento', key: 'tipoDocumento' },
            { header: 'Des_MedioTransporte', key: 'medioTransporte' },
            { header: 'Nom_UnidadEmpaque', key: 'unidadEmpaque' },
            { header: 'Num_ValorDeclarado', key: 'numValorDeclarado' },
            //{ header: 'Detalle', key: 'guia' },
            //{ header: 'Estado', key: 'estado' },
        ];
        return headers;
    }

    getName() {
        return EXPORTER_SERVIENTREGA_CD;
    }

}
