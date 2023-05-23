import {BaseRequester} from "../BaseRequester";
import {Order} from "../../../models/Order";
import {TrackingDelivery} from "./DeliveryStatusImpl";
import moment = require("moment");
import {CreateServientregaSoap} from "../../../templates/soap/servientrega/CreateServientregaSoap";

export class DeliveryStatusServientrega extends BaseRequester {

    protected  order;
    constructor(order: Order) {
        super();
        this.order = order;
    }

    getUrl(): any {
        return `http://sismilenio.servientrega.com.co/wsrastreoenvios/wsrastreoenvios.asmx?wsdl`;
    }

    call(): any {
    }

    getContext(res): any {

        if(res["EstadoGuiaResult"]){
            if(res["EstadoGuiaResult"]["diffgram"]){
                const newDataSet = res["EstadoGuiaResult"]["diffgram"]["NewDataSet"];
                if(newDataSet){
                    if(newDataSet['EstadosGuias']){
                        const guia = newDataSet['EstadosGuias'];

                        const ubicacion = guia['Novedad'];
                        const estatus = guia['Estado_Envio'] || 'Pendiente';
                        const fecha = guia['Fecha_entrega'];

                        const stopStatus = ['ANULADA', 'PENDIENTE POR BORRAR','EN ARCHIVO','ENTREGADO', 'ENTREGADO A REMITENTE', 'REPORTADO ENTREGADO', 'ENTREGA VERIFICADA'];
                        const shouldStop = stopStatus.includes(estatus.toLowerCase());

                        const tracking : TrackingDelivery = {
                            date: moment(fecha).toDate(),
                            status: estatus,
                            locality: ubicacion,
                            sync: !shouldStop
                        }

                        return tracking;

                    }
                }
            }

        }

    }

    getHeaders() : any {
        return null;
    }

    getMethod() : any {
        return "EstadoGuia";
    }

    getBody(order: Order) : any {
        return new CreateServientregaSoap(order);
    }

}
