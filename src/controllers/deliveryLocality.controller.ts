import {route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {DeliveryLocality} from "../models/DeliveryLocality";
import {EntityTarget} from "typeorm";
import {DeliveryLocalityService} from "../services/deliveryLocality.service";

@route('/deliveryLocality')
export class DeliveryLocalityController extends BaseController<DeliveryLocality> {
    constructor(
        private readonly deliveryLocalityService: DeliveryLocalityService
    ){
        super(deliveryLocalityService);
    };
    protected afterCreate(item: Object): void {}

    protected afterUpdate(item: Object): void {}

    protected beforeCreate(item: Object): void {}

    protected beforeUpdate(item: Object): void {}

    getEntityTarget(): EntityTarget<DeliveryLocality> {
        return DeliveryLocality;
    }

    getInstance(): Object {
        return new DeliveryLocality();
    }

    getParseGET(entity: DeliveryLocality): Object {
        return entity;
    }

    getParsePOST(entity: DeliveryLocality): Object {
        return entity;
    }

    getParsePUT(entity: DeliveryLocality): Object {
        return entity;
    }

}
