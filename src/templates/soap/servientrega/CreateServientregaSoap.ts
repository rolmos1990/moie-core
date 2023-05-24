import {BaseSoapTemplate} from "../BaseSoapTemplate";
import {Order} from "../../../models/Order";

export class CreateServientregaSoap extends BaseSoapTemplate {

    protected order;

    constructor(order: Order) {
        super();
        this.order = order;
    }

    getData() {

        const order = this.order;

        const result = {
            NumeroGuia: order.orderDelivery && order.orderDelivery.tracking
        };

        return result;
    }
}
