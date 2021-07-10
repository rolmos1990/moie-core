import {BaseController} from "../common/controllers/base.controller";
import {Size} from "../models/Size";
import {route} from "awilix-express";
import {EntityTarget} from "typeorm";
import {SizeService} from "../services/size.service";

@route('/size')
export class SizeController extends BaseController<Size> {

    constructor(
        private readonly sizeService: SizeService
    ){
        super(sizeService);
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

    getEntityTarget(): EntityTarget<Size> {
        return Size;
    }

    getInstance(): Object {
        return new Size();
    }

    getParseGET(entity: Size): Object {
        return entity;
    }

    getParsePOST(entity: Size): Object {
        return entity;
    }

    getParsePUT(entity: Size): Object {
        return entity;
    }
    getGroupRelations(): Array<string> {
        return [];
    }

}
