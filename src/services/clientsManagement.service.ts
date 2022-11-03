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

        const hasKey = this.headers.filter(item => (item['key'] === key))

        if(!hasKey[0]) {
            this.headers.push({key, value});
        }
    }

    getHeaders(){
        return this.headers;
    }

    async callSoapClient(options : SoapOptions) : Promise<SoapResult|any>{

        const wsdlOptions = {
            wsdl_headers: options.headerOptions,
            envelopeKey: "SOAP-ENV"
        };

        try {
            const args = options.body.getData();

            const request = new Promise((resolve, reject) => {
                soap.createClient(options.url, wsdlOptions, async (err, client) => {

                    this.headers.forEach(item => {
                        client.addHttpHeader(item['key'], item['value']);
                    });

                    const method = client[options.callMethod];

                    method(args, async (err, result) => {
                        if (!err) {
                            resolve(result);
                        } else {
                            reject("No se ha podido generar la solicitud");
                        }
                    });

                });
            });

            const requestResult = await request;
            return requestResult;

        }catch(e){
            console.log(e);
            throw new Error(e.message);
        }
    }
}
