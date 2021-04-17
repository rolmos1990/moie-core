import {BaseController} from "../common/controllers/base.controller";
import {Size} from "../models/Size";
import {route} from "awilix-express";
import {EntityTarget} from "typeorm";
import {SizeService} from "../services/size.service";
import {FieldOption} from "../models/FieldOption";
import {FieldOptionService} from "../services/fieldOption.service";

@route('/fieldOption')
export class FieldOptionController extends BaseController<FieldOption> {

    constructor(
        private readonly fieldOptionService: FieldOptionService
    ){
        super(fieldOptionService);
    };

    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    protected getDefaultRelations(): Array<string> {
        return [];
    }

    getEntityTarget(): EntityTarget<FieldOption> {
        return FieldOption;
    }

    getInstance(): Object {
        return new FieldOption();
    }

    getParseGET(entity: FieldOption): Object {
        return entity;
    }

    getParsePOST(entity: FieldOption): Object {
        return entity;
    }

    getParsePUT(entity: FieldOption): Object {
        return entity;
    }

}
