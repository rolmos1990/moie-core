import {BaseController} from "../common/controllers/base.controller";
import {TemplateCatalog} from "../models/TemplateCatalog";
import {EntityTarget} from "typeorm";
import {TemplateCatalogService} from "../services/templateCatalog.service";
import {route} from "awilix-express";

@route('/templateCatalog')
export class TemplateCatalogController extends BaseController<TemplateCatalog> {
    constructor(
        private readonly templateCatalogService: TemplateCatalogService
    ){
        super(templateCatalogService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<TemplateCatalog> {
        return TemplateCatalog;
    }

    getInstance(): Object {
        return new TemplateCatalog();
    }

    getParseGET(entity: TemplateCatalog): Object {
        return entity;
    }

    getParsePOST(entity: TemplateCatalog): Object {
        return entity;
    }

    getParsePUT(entity: TemplateCatalog): Object {
        return entity;
    }

    protected getDefaultRelations(): Array<string> {
        return [];
    }
    getGroupRelations(): Array<string> {
        return [];
    }

}
