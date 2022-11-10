import {BaseRequester} from "../BaseRequester";
import {Order} from "../../../models/Order";
import {DeliveryStatusInterrapidisimo} from "./DeliveryStatusInterrapidisimo";
import {InvalidFileException} from "../../exceptions";
const axios = require('axios');


export type TrackingDelivery = {
    date: Date,
    status: string,
    locality: string,
    sync: boolean
}

export class DeliveryStatusImpl extends BaseRequester{
    private caller : BaseRequester;
    private order: Order;

    constructor(order: Order){
        super();
        this.order = order;
        switch(order.deliveryMethod.code){
            case "INTERRAPIDISIMO":
                this.caller = new DeliveryStatusInterrapidisimo(this.order);
                break;
            case "PAYU":
                this.caller = new DeliveryStatusInterrapidisimo(this.order);
                break;
            default:
                throw new InvalidFileException("La orden no puede ser procesada o no se consiguio un tipo asociado");
        }
    }

    getContext(response : any): any {
        return this.caller.getContext(response);
    }

    getUrl(): any {
        return this.caller.getUrl();
    }

    async call(): Promise<TrackingDelivery> {
        try {
            const response = await axios.get(this.getUrl());
            const body = response.data;
            const parse : TrackingDelivery = this.getContext(body);
            return parse;
        }catch(e){
            return e;
        }
    }
}
