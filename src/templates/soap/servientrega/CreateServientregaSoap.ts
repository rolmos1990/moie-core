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
            ID_Cliente: 901092426,
            guia: order.orderDelivery && order.orderDelivery.tracking
        };

        return result;
    }
}
