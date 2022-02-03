import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {Municipality} from "../models/Municipality";
import {MunicipalityService} from "../services/municipality.service";
import {route} from "awilix-express";
import {PageQuery} from "../common/controllers/page.query";

@route('/municipality')
export class MunicipalityController extends BaseController<Municipality> {
    constructor(
        private readonly municipalityService: MunicipalityService
    ){
        super(municipalityService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<Municipality> {
        return Municipality;
    }

    getInstance(): Object {
        return new Municipality();
    }

    getParseGET(entity: Municipality): Object {
        return entity;
    }

    getParsePOST(entity: Municipality): Object {
        return entity;
    }

    getParsePUT(entity: Municipality): Object {
        return entity;
    }

    /** Start - Configuration for Disabled Order by default list */
    protected customDefaultOrder?() {
    }

    protected getDefaultRelations(): Array<string> {
        return ['state'];
    }
    getGroupRelations(): Array<string> {
        return [];
    }
}
