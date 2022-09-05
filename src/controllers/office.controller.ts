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
import {ImporterImpl} from "../templates/importers/importerImpl";
import {LIMIT_SAVE_BATCH} from "../common/persistence/mysql.persistence";
import {OrderDeliveryService} from "../services/orderDelivery.service";
import {getDeliveryShortType} from "../common/helper/helpers";
import {BatchRequestTypes, BatchRequestTypesStatus} from "../common/enum/batchRequestTypes";
import {TemplateService} from "../services/template.service";
import {DeliveryStatus} from "../common/enum/deliveryStatus";
import {OfficeReportTypes} from "../common/enum/officeReportTypes";
import {ExportersOfficeCd} from "../templates/exporters/office-orders.exporters";
import {OrderHistoricService} from "../services/orderHistoric.service";
import {TemplatesRegisters} from "../common/enum/templatesTypes";
import {ExportersOfficeMensajeroCd} from "../templates/exporters/office-orders-mensajero.exporters";
import {DeliveryMethodService} from "../services/deliveryMethod.service";
import {Modules} from "../common/enum/modules";

@route('/office')
export class OfficeController extends BaseController<Office> {
    constructor(
        protected readonly officeService: OfficeService,
        protected readonly userService: UserService,
        protected readonly orderService: OrderService,
        protected readonly mediaManagementService: MediaManagementService,
        protected readonly orderDeliveryService: OrderDeliveryService,
        protected readonly templateService: TemplateService,
        protected readonly orderHistoricService: OrderHistoricService,
        protected readonly deliveryMethodService: DeliveryMethodService
    ){
        super(officeService, userService);
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

            const userIdFromSession = req['user'].id;
            const user = await this.userService.find(userIdFromSession);

            if (id) {
                const office : Office = await this.officeService.find(parseInt(id), ['deliveryMethod', 'user']);

                //Changes orders status (only has printed)
                let orders = await this.orderService.findByObject({office: office}, ['orderDelivery', 'deliveryMethod']);
                orders = orders.filter(order => order.isPrinted());

                if(orders.length > 0){
                    await Promise.all(orders.map(async item => {
                        await this.orderService.updateNextStatusFromModule(item, user, Modules.Offices);
                    }));
                }

                office.status = 2;
                await this.officeService.createOrUpdate(office);
                return res.json({status: 200, office: OfficeListDTO(office) } );
            } else {
                throw new InvalidArgumentException();
            }
        }catch(e){
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Despacho: Algunos estados de pedidos no pueden ser finalizados."), res);
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

    @route('/:id/deleteOrder')
    @POST()
    protected async deleteOrder(req: Request, res: Response){
        const id = req.params.id;
        const idOrder = req.body.order;

        try {
            if (id && idOrder) {
                await this.orderService.removeOffice(idOrder);
                const office : Office = await this.officeService.find(parseInt(id));
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

    /**
     * Obtener plantilla de impresión
     * @param req
     * @param res
     */
    @route('/batch/printRequest/:id')
    @GET()
    public async printRequest(req: Request, res: Response) {
        try {
            const {id} = req.params;

            let orders: Array<Order> = await this.orderService.findByObject({office: id}, ['orderDelivery', 'customer','customer.state','customer.municipality', 'deliveryMethod']);

            if(orders.length > 0){

                let batchHtml : any = [];

                const result = orders.map(async order => {
                    const templateName = this.orderService.getExportOfficeReport(order);
                    const deliveryShortType = getDeliveryShortType(order.orderDelivery.deliveryType);
                    const object = {
                        order,
                        deliveryShortType: deliveryShortType
                    };

                    const template = await this.templateService.getTemplate(templateName, object);
                    if(!template){
                        throw new InvalidArgumentException("No se ha encontrado una plantilla para esta orden");
                    }

                    return batchHtml.push({order: order.id, html: template});
                });

                await Promise.all(result);

                //const user = await this.userService.find(req["user"]);

                const response = {
                    body: batchHtml,
                    type: BatchRequestTypes.IMPRESSION,
                    status: BatchRequestTypesStatus.COMPLETED,
                    //user: UserShortDTO(user)
                };

                return res.json({status: 200, batch: {...response}});

            } else {
                return res.json({status: 400, error: "No se han encontrado registros"});
            }
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    /** Download Template for Interrapidisimo Delivery Service */
    @route('/:id/getTemplate')
    @GET()
    protected async getTemplate(req: Request, res: Response){
        try {
            const id = req.params.id;
            const office: Office = await this.officeService.find(parseInt(id));
            const orders: Order[] = await this.orderService.findByObject({office: office}, ['customer', 'customer.municipality', 'orderDelivery', 'orderDelivery.deliveryLocality']); //TODO -- Agregar orderDelivery.deliveryLocality'
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

    @route('/gen/officePdfReport/:id')
    @GET()
    public async officePdfReport(req: Request, res: Response){
        try {
        const id = req.params.id;
        const office: Office = await this.officeService.find(parseInt(id));
        const orders: Order[] = await this.orderService.findByObject({office: office}, ['customer', 'customer.municipality', 'customer.state', 'orderDelivery','deliveryMethod']);

            const object = {
                orders: orders,
                office : office
            };

            const template = await this.templateService.getTemplate(TemplatesRegisters.OFFICE_PDF, object);

            if(!template){
                throw new InvalidArgumentException("No se ha podido generar el reporte");
            }
            return res.json({status: 200, html: template});

        }catch(e){
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Despacho no ha sido encontrado"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);
            }
        }
    }

    @route('/gen/officeReport')
    @GET()
    public async officeReport(req: Request, res: Response){
        try {
            const {type, date} = req.query;

            if (!(type === OfficeReportTypes.PREVIOUS_PAYMENT || type === OfficeReportTypes.MENSAJERO)) {
                throw new InvalidArgumentException("Tipo no valido");
            }
            const orders: Order[] = await this.officeService.getDataForReport(date, type);

            const exportableInterrapidisimo = new ExportersOfficeCd();
            const exportableMensajero = new ExportersOfficeMensajeroCd();

            const exportable = type === OfficeReportTypes.MENSAJERO ? exportableMensajero : exportableInterrapidisimo;


            const base64File = await this.mediaManagementService.createExcel(exportable, orders, res, MEDIA_FORMAT_OUTPUT.b64);
            return res.json({status: 200, data: base64File, name: exportable.getFileName()});
        }catch(e){
            console.log("error: ", e.message);
            this.handleException(new ApplicationException(), res);
        }
    }

    /** Import File Delivery Information in System (POST VENTA) */
    @route('/importFile')
    @POST()
    protected async importFile(req: Request, res: Response){
        try {
            const body = req.body;

            const { file, deliveryDate, deliveryMethod } = body;

            const userIdFromSession = req['user'].id;
            const user = await this.userService.find(userIdFromSession);

            const excel = await this.mediaManagementService.readExcel(file);
            const excelToSave = new ImporterImpl(deliveryMethod, excel);
            const context = excelToSave.getContext();
            const ids = context.map(item => item.id);

            const orders = await this.orderService.findByIds(ids);
            const ordersToUpdate = [];

            /** Actualizar todos los registros asociados */
            const orderDeliveries = orders.filter(i => i.orderDelivery).map(item => {
                const tracking = context.filter(i => item.id === parseInt(i.id));
                if(tracking && tracking[0]) {
                    item.orderDelivery.tracking = tracking[0].trackingNumber;
                    ordersToUpdate.push(item);
                }
                return {id: item.orderDelivery.id, tracking: item.orderDelivery.tracking, deliveryDate: new Date(), deliveryStatus: DeliveryStatus.PENDING, sync: true};
            });

            const registers = await this.orderDeliveryService.createOrUpdate(orderDeliveries, {chunk: LIMIT_SAVE_BATCH});

            //update status
            await Promise.all(ordersToUpdate.map(async item => {
                await this.orderService.updateNextStatusFromModule(item, user, Modules.PostVenta);
            }));

            return res.json({status: 200, data: {registers: registers} } );
        }catch(e){
            console.log("error -- ", e.message);
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Despacho no ha sido encontrado"), res);
            } else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    protected getDefaultRelations(): Array<string> {
        return ['deliveryMethod', 'user', 'viewOrders'];
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
