import {UtilService} from "../common/controllers/util.service";
import {BaseSoapTemplate} from "../templates/soap/BaseSoapTemplate";
const soap = require('soap');


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

    async callSoapClient(options : SoapOptions) : Promise<SoapResult|any>{
        try {
            const args = options.body.getData();
            await Promise.all(soap.createClient(options.url, {wsdl_headers: options.headerOptions, stream: true, namespaceArrayElements: true}, (err, client) => {
                client[options.callMethod](args, function (err, result) {
                    //if (err) throw new Error(err);
                    console.log(args);
                    console.log(soap);
                    console.log("data error message");
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
