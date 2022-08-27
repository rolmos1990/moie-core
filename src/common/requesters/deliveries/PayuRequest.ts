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
        return `${process.env.WEBSITE_URL}/checkout/generar_link_pago`;
    }

    async call(): Promise<TrackingDelivery> {
        try {
            const payload = this.payu;

            const response = await axios.post(this.getUrl(), payload);
            const body = response.data;
            console.log('response', response);
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
