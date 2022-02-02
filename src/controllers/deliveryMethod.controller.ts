import {GET, POST, PUT, route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {DeliveryMethod} from "../models/DeliveryMethod";
import {DeliveryMethodService} from "../services/deliveryMethod.service";
import {Request, Response} from "express";
import {RequestQuoteDTO} from "./parsers/quote";
import {FieldOptionService} from "../services/fieldOption.service";

@route('/deliveryMethod')
export class DeliveryMethodController extends BaseController<DeliveryMethod> {
    constructor(
        private readonly deliveryMethodService: DeliveryMethodService
    ){
        super(deliveryMethodService);
    };
    protected afterCreate(item: Object): void {}

    protected afterUpdate(item: Object): void {}

    protected beforeCreate(item: Object): void {}

    protected beforeUpdate(item: Object): void {}

    getEntityTarget(): EntityTarget<DeliveryMethod> {
        return DeliveryMethod;
    }

    getInstance(): Object {
        return new DeliveryMethod();
    }

    getParseGET(entity: DeliveryMethod): Object {
        return entity;
    }

    getParsePOST(entity: DeliveryMethod): Object {
        return entity;
    }

    getParsePUT(entity: DeliveryMethod): Object {
        return entity;
    }

    protected getDefaultRelations(): Array<string> {
        return [];
    }
    @route('/quote')
    @POST()
    public async getQuote(req: Request, res: Response) {
        try {
            const quoteRequest = RequestQuoteDTO(req.body);
            const deliveryMethod = await this.deliveryMethodService.findByCode(quoteRequest.deliveryMethodCode);

            let quote = {
                amount: 0.00,
                hasCharge: true
            };
            if(deliveryMethod) {

                if (quoteRequest.deliveryMethodCode === "INTERRAPIDISIMO") {
                    quote = {
                        amount: 0.00,
                        hasCharge: true
                    };
                } else if (quoteRequest.deliveryMethodCode === "MENSAJERO") {
                    quote = {
                        amount: 0.00,
                        hasCharge: false
                    };
                }
            }
            return res.json(quote).status(200);
        }catch(e){
            this.handleException(e, res);
        }
    }
    getGroupRelations(): Array<string> {
        return [];
    }

}
