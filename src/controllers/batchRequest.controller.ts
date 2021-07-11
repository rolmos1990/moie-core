import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {BatchRequest} from "../models/BatchRequest";
import {BatchRequestService} from "../services/batchRequest.service";
import {route} from "awilix-express";

@route('/batchRequest')
export class BatchRequestController extends BaseController<BatchRequest> {
    constructor(
        private readonly batchRequestService: BatchRequestService
    ){
        super(batchRequestService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<BatchRequest> {
        return BatchRequest;
    }

    getInstance(): Object {
        return new BatchRequest();
    }

    getParseGET(entity: BatchRequest): Object {
        return entity;
    }

    getParsePOST(entity: BatchRequest): Object {
        return entity;
    }

    getParsePUT(entity: BatchRequest): Object {
        return entity;
    }

    protected getDefaultRelations(): Array<string> {
        return [];
    }
    getGroupRelations(): Array<string> {
        return [];
    }
}
