import {BaseRequester} from "../BaseRequester";
import {Order} from "../../../models/Order";
import {DeliveryStatusInterrapidisimo} from "./DeliveryStatusInterrapidisimo";
import {InvalidFileException} from "../../exceptions";
import {DeliveryStatusServientrega} from "./DeliveryStatusServientrega";
import {ClientsManagementService} from "../../../services/clientsManagement.service";
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
    private soapCaller: ClientsManagementService;
    private rest: boolean;

    constructor(order: Order){
        super();
        this.order = order;
        switch(order.deliveryMethod.code){
            case "INTERRAPIDISIMO":
                this.rest = true;
                this.caller = new DeliveryStatusInterrapidisimo(this.order);
                break;
            case "SERVIENTREGA":
                this.rest = false;
                this.soapCaller = new ClientsManagementService();
                this.caller = new DeliveryStatusServientrega(this.order);
                break;
            case "PAYU":
                this.rest = true;
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

    getHeaders() : any {
        return this.caller.getHeaders();
    }

    getMethod() : any {
        return this.caller.getMethod();
    }

    getBody(order: Order) : any {
        return this.caller.getBody(order);
    }

    async call(): Promise<TrackingDelivery> {
        try {
            if(this.rest) {
                const response = await axios.get(this.getUrl());
                const body = response.data;
                const parse: TrackingDelivery = this.getContext(body);
                return parse;
            } else {

                const options = {
                    url: this.getUrl(),
                    headerOptions: this.getHeaders(),
                    body: this.getBody(this.order),
                    callMethod: this.getMethod()
                };

                const response = await this.soapCaller.callSoapClient(options);
                const parse: TrackingDelivery = this.getContext(response);
                return parse;

            }
        }catch(e){
            console.log('error: ', e.message);
            return e;
        }
    }

}
