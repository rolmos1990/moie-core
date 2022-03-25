import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {SecurityPermission} from "../models/SecurityPermission";
import {SecurityPermissionService} from "../services/securityPermission.service";
import {route} from "awilix-express";
import {SecurityRolArrayShortDTO, SecurityRolShortDTO} from "./parsers/securityRol";

@route('/securityPermission')
export class SecurityPermissionController extends BaseController<SecurityPermission> {
    constructor(
        private readonly securityPermissionService: SecurityPermissionService
    ){
        super(securityPermissionService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<SecurityPermission> {
        return SecurityPermission;
    }

    getInstance(): Object {
        return new SecurityPermission();
    }

    getParseGET(entity: SecurityPermission, isDetail: false): Object {
        return entity;
    }

    getParsePOST(entity: SecurityPermission): Object {
        return entity;
    }

    getParsePUT(entity: SecurityPermission): Object {
        return entity;
    }

    protected customDefaultOrder?() {
    }

    protected getDefaultRelations(): Array<string> {
        return [];
    }

    getGroupRelations(): Array<string> {
        return [];
    }
}
