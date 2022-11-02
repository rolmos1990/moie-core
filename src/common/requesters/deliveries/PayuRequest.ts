import {BaseRequester} from "../BaseRequester";
import {PayuI} from "../../interfaces/PayuI";
import {TrackingDelivery} from "./DeliveryStatusImpl";
import {toFormData} from "../../helper/helpers";
const axios = require('axios');

export class PayuRequest extends BaseRequester {

    protected  payu;
    constructor(payu: PayuI) {
        super();
        this.payu = payu;
    }

    getUrl(): any {
        // add some comment
        return `${process.env.WEBSITE_URL}/checkout/generar_link_pago`;
    }

    async call(): Promise<TrackingDelivery> {
        try {
            const payload = this.payu;
            console.log('generating payment: ', this.getUrl());
            const response = await axios.post(this.getUrl(), payload);
            const body = response.data;
            const parse : any = this.getContext(body);
            return parse;
        }catch(e){
            return e;
        }
    }

    getContext(data): any {
        return data;
    }

}
