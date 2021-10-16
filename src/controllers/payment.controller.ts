import {route} from 'awilix-express';
import {PaymentService} from "../services/payment.service";
import {BaseController} from "../common/controllers/base.controller";
import {Payment} from "../models/Payment";
import {EntityTarget} from "typeorm";
import {PaymentCreateDTO} from "./parsers/payment";

@route('/payment')
export class PaymentController extends BaseController<Payment> {
    constructor(
        private readonly paymentService: PaymentService,
    ){
        super(paymentService);
    };

    public getInstance() : Payment{
        return new Payment();
    }

    getParseGET(entity: Payment): Object {
        return entity;
    }

    getParsePOST(entity: Payment): Object {
        return PaymentCreateDTO(entity);
    }

    getParsePUT(entity: Payment): Object {
        return entity;
    }

    public getEntityTarget(): EntityTarget<any> {
        return Payment;
    }

    protected beforeCreate(item: Payment){}
    protected afterCreate(item: Object): void {}
    protected afterUpdate(item: Object): void {}
    protected beforeUpdate(item: Object): void {}

    protected getDefaultRelations(): Array<string> {
        return [];
    }
    getGroupRelations(): Array<string> {
        return [];
    }
}
