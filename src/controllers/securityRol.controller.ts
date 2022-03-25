import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {SecurityRol} from "../models/SecurityRol";
import {SecurityRolService} from "../services/securityRol.service";
import {POST, route} from "awilix-express";
import {SecurityRolArrayShortDTO, SecurityRolShortDTO} from "./parsers/securityRol";
import {SecurityPermissionService} from "../services/securityPermission.service";
import {Request, Response} from "express";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";

@route('/securityRol')
export class SecurityRolController extends BaseController<SecurityRol> {
    constructor(
        private readonly securityRolService: SecurityRolService,
        private readonly securityPermissionService: SecurityPermissionService
    ){
        super(securityRolService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    /** Example to add body {permission: 'user.list'} */
    @route('/:id/addPermission')
    @POST()
    protected async addPermission(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            const idPermission = req.body.permission;
            const rol = await this.securityRolService.find(id, ['permissions']);
            const permission = await this.securityPermissionService.findByObject({permission: idPermission});
            if(!rol.permissions){
                rol.permissions = [];
            }
            rol.permissions.push(permission[0]);
            await this.securityRolService.createOrUpdate(rol);
            return res.json({status: 200 } );
        }catch(e){
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Orden no ha sido encontrada"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    /** Example to remove in body {permission: 'user.list'} */
    @route('/:id/removePermission')
    @POST()
    protected async removePermission(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            const idPermission = req.body.permission;
            const rol = await this.securityRolService.find(id, ['permissions']);
            const permission = await this.securityPermissionService.findByObject({permission: idPermission});
            if(!rol.permissions){
                rol.permissions = [];
            }
            rol.permissions = rol.permissions.filter(item => item.permission != permission[0].permission);
            await this.securityRolService.createOrUpdate(rol);
            return res.json({status: 200 } );
        }catch(e){
        if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
            this.handleException(new InvalidArgumentException("Orden no ha sido encontrada"), res);
        }
        else{
            this.handleException(new ApplicationException(), res);

        }
    }
    }

    getEntityTarget(): EntityTarget<SecurityRol> {
        return SecurityRol;
    }

    getInstance(): Object {
        return new SecurityRol();
    }

    getParseGET(entity: SecurityRol, isDetail: false): Object {
        if(!isDetail){
            return SecurityRolArrayShortDTO(entity);
        }
        return SecurityRolShortDTO(entity);
    }

    getParsePOST(entity: SecurityRol): Object {
        return entity;
    }

    getParsePUT(entity: SecurityRol): Object {
        return entity;
    }

    protected customDefaultOrder?() {
    }

    protected getDefaultRelations(): Array<string> {
        return ['permissions'];
    }

    getGroupRelations(): Array<string> {
        return [];
    }
}
