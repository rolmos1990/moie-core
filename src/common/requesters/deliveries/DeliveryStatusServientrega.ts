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

        if(res['ConsultarGuiaResult']){
            if(res['ConsultarGuiaResult']['Mov']){
                const movimientos = res['ConsultarGuiaResult']['Mov'];
                var guia = movimientos['InformacionMov'].pop();
                if(guia['NomMov']){

                    const fecha = guia['FecMov'];
                    const estatus = guia['NomMov'] || 'Pendiente';
                    const ubicacion = guia['OriMov'];

                    const stopStatus = ['REPORTADO ENTREGADO', 'ENTREGA VERIFICADA'];
                    let shouldStop = stopStatus.includes(estatus.toUpperCase());

                    const stopIntStatus = [4,5,9,10,11];
                    //estados que no continuan
                    if(stopIntStatus.includes(parseInt(guia['IdEstAct']))){
                        shouldStop = true;
                    }

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

    getHeaders() : any {
        return null;
    }

    getMethod() : any {
        return "ConsultarGuia";
    }

    getBody(order: Order) : any {
        return new CreateServientregaSoap(order);
    }

}
