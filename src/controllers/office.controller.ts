import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {Office} from "../models/Office";
import {OfficeService} from "../services/office.service";
import {POST, route} from "awilix-express";
import {OfficeCreateDTO, OfficeListDTO} from "./parsers/office";
import {UserService} from "../services/user.service";
import {Request, Response} from "express";
import {IProductSize} from "../common/interfaces/IProductSize";
import {Product} from "../models/Product";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";

@route('/office')
export class OfficeController extends BaseController<Office> {
    constructor(
        private readonly officeService: OfficeService,
        private readonly userService: UserService
    ){
        super(officeService);
    };
    protected afterCreate(item: Object): void {

    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<Office> {
        return Office;
    }

    getInstance(): Object {
        return new Office();
    }

    getParseGET(entity: Office): Object {
        return OfficeListDTO(entity);
    }

    getParsePOST(entity: Office): Object {
        return OfficeCreateDTO(entity);
    }

    getParsePUT(entity: Office): Object {
        return entity;
    }


    @route('/:id/confirm')
    @POST()
    protected async confirm(req: Request, res: Response){
        const id = req.params.id;
        try {
            if (id) {
                const office : Office = await this.officeService.find(parseInt(id), ['deliveryMethod', 'user']);
                office.status = 2;
                await this.officeService.createOrUpdate(office);
                return res.json({status: 200, office: OfficeListDTO(office) } );
            } else {
                throw new InvalidArgumentException();
            }
        }catch(e){
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Producto no ha sido encontrado"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    protected getDefaultRelations(): Array<string> {
        return ['deliveryMethod', 'user'];
    }
    getGroupRelations(): Array<string> {
        return [];
    }

    /** Start - Configuration for AutoSave User */
    protected autoSaveUser?(): boolean {
        return true;
    }

    protected getUserService(){
        return this.userService;
    }
    /** End - Configuration for AutoSave User */

}
