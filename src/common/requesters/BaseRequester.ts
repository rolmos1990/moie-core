import {Order} from "../../models/Order";

export abstract class BaseRequester {
    protected url : string;
    protected type: string;
    abstract getUrl(): any;
    abstract getMethod(): any;
    abstract getHeaders(): any;
    abstract getContext(response : any) : any;
    abstract getBody(order : Order) : any;
    abstract async call(): Promise<Object>
}

