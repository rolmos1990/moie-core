import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {Office} from "../models/Office";
import {OfficeService} from "../services/office.service";
import {GET, POST, route} from "awilix-express";
import {OfficeCreateDTO, OfficeListDTO} from "./parsers/office";
import {UserService} from "../services/user.service";
import {Request, Response} from "express";
import {ApplicationException, InvalidArgumentException, InvalidFileException} from "../common/exceptions";
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
import {OrderStatus} from "../common/enum/orderStatus";
import {getDeliveryShortType, QrBarImage} from "../common/helper/helpers";
import {isCash, isPaymentMode} from "../common/enum/paymentModes";
import {BatchRequestTypes, BatchRequestTypesStatus} from "../common/enum/batchRequestTypes";
import {UserShortDTO} from "./parsers/user";
import {TemplateService} from "../services/template.service";

@route('/office')
export class OfficeController extends BaseController<Office> {
    constructor(
        private readonly officeService: OfficeService,
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly mediaManagementService: MediaManagementService,
        private readonly orderDeliveryService: OrderDeliveryService,
        private readonly templateService: TemplateService
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

    /**
     * Obtener plantilla de impresión
     * @param req
     * @param res
     */
    @route('/batch/printRequest/:id')
    @GET()
    public async printRequest(req: Request, res: Response) {
        try {
            const {id} = req.query;

            let orders: Array<Order> = await this.orderService.findByObject({office: id}, ['orderDelivery', 'customer','customer.state','customer.municipality']);

            if(orders.length > 0){

                let batchHtml : any = [];
                const qrBar : any = [];

                const result = orders.map(async order => {
                    const templateName = this.orderService.getExportOfficeReport(order);
                    qrBar[order.id] = await QrBarImage(order.id);
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

                const user = await this.userService.find(req["user"]);

                const response = {
                    body: batchHtml,
                    type: BatchRequestTypes.IMPRESSION,
                    status: BatchRequestTypesStatus.COMPLETED,
                    user: UserShortDTO(user)
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

    /** Import File Delivery Information in System */
    @route('/importFile')
    @POST()
    protected async importFile(req: Request, res: Response){
        try {
            const body = req.body;

            const { file, deliveryDate, deliveryMethod } = body;

            const excel = await this.mediaManagementService.readExcel(file);
            const excelToSave = new ImporterImpl(deliveryMethod, excel);
            const context = excelToSave.getContext();
            const ids = context.map(item => item.id);

            const orders = await this.orderService.findByIdsWithDeliveries(ids);
            /** Actualizar todos los registros asociados */
            const orderDeliveries = orders.filter(i => i.orderDelivery).map(item => {
                const tracking = context.filter(i => item.id === parseInt(i.id));
                if(tracking && tracking[0]) {
                    item.orderDelivery.tracking = tracking[0].trackingNumber;
                }
                return {id: item.orderDelivery.id, tracking: item.orderDelivery.tracking};
            });

            const registers = await this.orderDeliveryService.createOrUpdate(orderDeliveries, {chunk: LIMIT_SAVE_BATCH});

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
