import {BaseRequester} from "../BaseRequester";
import {Order} from "../../../models/Order";
import {TrackingDelivery} from "./DeliveryStatusImpl";
import moment = require("moment");

export class DeliveryStatusInterrapidisimo extends BaseRequester {

    protected  order;
    constructor(order: Order) {
        super();
        this.order = order;
    }

    getUrl(): any {
        return `https://www3.interrapidisimo.com/ApiservInter/api/Mensajeria/ObtenerRastreoGuias?guias=${this.order.orderDelivery.tracking}`;
    }

    call(): any {
    }

    getContext(body): any {

        const movimiento = (body[0]["EstadosGuia"].slice(-1))[0]["EstadoGuia"];
        const fecha = movimiento['FechaGrabacion'];
        const ubicacion = movimiento['Ciudad'];
        const estatus = movimiento['DescripcionEstadoGuia'].replace(/\s+/g, ' ');

        const stopStatus = ['entrega exitosa', 'devuelto al remitente'];
        const shouldStop = stopStatus.includes(estatus.toLowerCase());

        const tracking : TrackingDelivery = {
            date: moment(fecha).toDate(),
            status: estatus,
            locality: ubicacion,
            sync: !shouldStop
        }

        return tracking;
    }

    getHeaders() : any {
        return null;
    }

    getMethod() : any {
        return null;
    }

    getBody() : any {
        return null;
    }

}
