import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {StateService} from "../services/state.service";
import {route} from "awilix-express";
import {Template} from "../models/Template";
import {TemplateService} from "../services/template.service";

@route('/template')
export class TemplateController extends BaseController<Template> {
    constructor(
        private readonly templateService: TemplateService
    ){
        super(templateService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<Template> {
        return Template;
    }

    getInstance(): Object {
        return new Template();
    }

    getParseGET(entity: Template): Object {
        return entity;
    }

    getParsePOST(entity: Template): Object {
        return entity;
    }

    getParsePUT(entity: Template): Object {
        return entity;
    }

    protected getDefaultRelations(): Array<string> {
        return [];
    }

}
