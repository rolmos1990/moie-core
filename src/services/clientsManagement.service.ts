import {UtilService} from "../common/controllers/util.service";
import {BaseSoapTemplate} from "../templates/soap/BaseSoapTemplate";
import {WSSecurity} from "soap";
//const soap = require('soap');
const soap = require('strong-soap').soap;
const WSDL = soap.WSDL;


export type SoapOptions = {
    url: string,
    headerOptions: Object,
    body: BaseSoapTemplate,
    callMethod: string
};

export type SoapResult = {
    result: Object | null,
    error: Object | null
};


export class ClientsManagementService extends UtilService {
    private headers : Object[] = [];

    addHeaders(key,value){
        this.headers.push({ key, value });
    }

    async callSoapClient(options : SoapOptions) : Promise<SoapResult|any>{

        const wsdlOptions = {
            wsdl_headers: options.headerOptions,
            envelopeKey: "SOAP-ENV"
        };

        try {
            const args = options.body.getData();
            await Promise.all(soap.createClient(options.url, wsdlOptions, (err, client) => {

                this.headers.forEach(item => {
                    client.addHttpHeader(item['key'], item['value']);
                });

                const method = client[options.callMethod];
                method(args, function (err, result) {
                    console.log(client.lastRequest);
                    if(!err) {
                        return {result: result, error: null};
                    }
                    throw new Error(err);
                })
            }));
        }catch(e){
            throw new Error(e.message);
        }
    }
}
