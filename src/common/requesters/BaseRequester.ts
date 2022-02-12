export abstract class BaseRequester {
    protected url : string;
    protected type: string;
    abstract getUrl(): any;
    abstract getContext(response : any) : any;
    abstract async call(): Promise<Object>
}

