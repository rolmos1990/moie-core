import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {Office} from "../models/Office";
import {OfficeService} from "../services/office.service";
import {GET, POST, route} from "awilix-express";
import {OfficeCreateDTO, OfficeListDTO} from "./parsers/office";
import {UserService} from "../services/user.service";
import {Request, Response} from "express";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {ConditionalQuery} from "../common/controllers/conditional.query";
import {OperationQuery} from "../common/controllers/operation.query";
import {PageQuery} from "../common/controllers/page.query";
import {OrderConditional} from "../common/enum/order.conditional";
import {OrderService} from "../services/order.service";
import {Order} from "../models/Order";
import {MEDIA_FORMAT_OUTPUT, MediaManagementService} from "../services/mediaManagement.service";
import {ExportersInterrapidisimoCd} from "../templates/exporters";

@route('/office')
export class OfficeController extends BaseController<Office> {
    constructor(
        private readonly officeService: OfficeService,
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly mediaManagementService: MediaManagementService
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

    @route('/:id/addOrder')
    @POST()
    protected async addOrder(req: Request, res: Response){
        const id = req.params.id;

        try {
            if (id) {

                const query = req.query;
                const conditional = query.conditional ? query.conditional + "" : null;
                const offset = query.offset ? query.offset + "" : "0";
                const pageNumber = parseInt(offset);
                const limit = query.limit ? parseInt(query.limit + "") : 100;
                const queryCondition = ConditionalQuery.ConvertIntoConditionalParams(conditional);
                const operationQuery = new OperationQuery(null, null);
                let page = new PageQuery(limit,pageNumber,queryCondition, operationQuery);

                if(!query.operation){
                    page.addOrder('id', OrderConditional.DESC);
                }

                const office : Office = await this.officeService.find(parseInt(id));
                await this.orderService.updateOffices(office, queryCondition.get());
                return res.json({status: 200, office: OfficeListDTO(office) } );

            } else {
                throw new InvalidArgumentException();
            }
        }catch(e){
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Despacho no ha sido encontrado"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    /** Download Template for Interrapidisimo Delivery Service */
    @route('/:id/getTemplate')
    @GET()
    protected async getTemplate(req: Request, res: Response){
        try {
            const id = req.params.id;
            const office: Office = await this.officeService.find(parseInt(id));
            const orders: Order[] = await this.orderService.findByObject({office: office}, ['customer', 'customer.municipality']); //TODO -- Agregar orderDelivery.deliveryLocality'
            const exportable = new ExportersInterrapidisimoCd();

            const base64File = await this.mediaManagementService.createExcel(exportable, orders, res, MEDIA_FORMAT_OUTPUT.b64);
            return res.json({status: 200, data: base64File, name: exportable.getFileName() } );
        }catch(e){
            console.log("error -- ", e.message);
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Despacho no ha sido encontrado"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    //exportReport ->

    /** Download Template for Interrapidisimo Delivery Service */
    //@route('/importTracking')
    // -> un file (base64), deliveryMethod (metodo de envio), deliveryDate (fecha del envio)
    //success ->


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
