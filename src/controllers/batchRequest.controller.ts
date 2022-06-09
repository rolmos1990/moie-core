import {EntityTarget} from "typeorm";
import {BatchRequest} from "../models/BatchRequest";
import {BatchRequestService} from "../services/batchRequest.service";
import {route} from "awilix-express";
import {UserRequiredController} from "../common/controllers/userRequired.controller";
import {UserService} from "../services/user.service";
import {BatchRequestTypesStatus} from "../common/enum/batchRequestTypes";

@route('/batchRequest')
export class BatchRequestController extends UserRequiredController<BatchRequest> {
    constructor(
        protected readonly userService: UserService,
        protected readonly batchRequestService: BatchRequestService
    ){
        super(userService, batchRequestService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: any): void {
        if(item.status === BatchRequestTypesStatus.EXECUTED){
        }
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
