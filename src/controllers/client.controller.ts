import {BaseController} from "../common/controllers/base.controller";
import {Customer} from "../models/Customer";
import {EntityTarget} from "typeorm";
import {CustomerService} from "../services/customer.service";
import {GET, POST, route} from "awilix-express";
import {
    CustomerCreateDTO,
    CustomerListDTO,
    CustomerShowDTO,
    CustomerUpdateDTO, OrderStats, requestOrderStatDTO, requestStatDTO,
    Stats
} from "./parsers/customer";
import { PageQuery } from "../common/controllers/page.query";
import {Request, Response} from "express";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {getAllStatus} from "../common/enum/orderStatus";
import moment = require("moment");
import {MEDIA_FORMAT_OUTPUT, MediaManagementService} from "../services/mediaManagement.service";
import {ExportersCustomers} from "../templates/exporters/exporters-customers";
import {ConditionalQuery} from "../common/controllers/conditional.query";
import {OperationQuery} from "../common/controllers/operation.query";
import {OrderConditional} from "../common/enum/order.conditional";
import {isEmpty} from "../common/helper/helpers";
import {PageDTO} from "./parsers/page";
import {CustomerOrderService} from "../services/customerorder.service";
import {ViewCustomerOrder} from "../models/ViewCustomerOrder";
import {ExportersCustomersFull} from "../templates/exporters/exporters-customers-full";

@route('/customer')
export class CustomerController extends BaseController<Customer> {

    /**
     * @swagger
     * definitions:
     *   Error:
     *     type: object
     *     properties:
     *       message:
     *         type: string
     */

    constructor(
        private readonly customerService: CustomerService,
        private readonly mediaManagementService: MediaManagementService,
        private readonly customerOrderService: CustomerOrderService
    ){
        super(customerService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected async beforeCreate(item: Object): Promise<void> {
        const document = item['document'];
        const documentExists = await this.customerService.findByObject({document: document});
        if(documentExists && documentExists.length > 0){
            throw new ApplicationException('doc_exists');
        }
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<Customer> {
        return Customer;
    }

    getInstance(): Object {
        return new Customer();
    }

    @POST()
    @route('/get/salesFinished')
    async salesFinished(req: Request, res: Response){
        try {
            const {customers} = req.body;
            if (customers && customers.length > 0) {
                const orders = await this.customerService.getOrdersFinishedForCustomers(customers);
                res.json(orders);
            } else {
                res.json([]);
            }
        } catch (e) {
            console.log("error generado...", e);
            this.handleException(e, res);
        }
    }

    /** --> query {{base_url}}/customer/77032/stats?beforeDate=2000-10-10&afterDate=1998-10-10&categoryMode=true */
    /** Obtener estadisticas de productos {qty, sumPrice, productId, name} */
    @GET()
    @route('/:id/stats')
    async getProductsStats(req: Request, res: Response){
        try {
            const id = req.params.id;
            const params = req.query;
            const customer = await this.customerService.find(parseInt(id));

            const queryData = await requestStatDTO(params);
            const beforeDate = queryData.beforeDate || null;
            const afterDate = queryData.afterDate || null;
            const categoryMode = queryData.categoryMode;

            const stats = await this.customerService.getOrdersByProduct(customer, getAllStatus(), beforeDate, afterDate, categoryMode);
            const statsFormat = Stats(stats) || [];
            res.json(statsFormat);
        }catch(e){
            console.log("error generado...", e);
            this.handleException(e, res);
        }
    }

    /* categoryMode -> opcional */
    /** query: {{base_url}}/customer/77032/order_stats??beforeDate=2000-10-10&afterDate=1998-10-10 */
    /** Obtener estadisticas de Ordenes {status, qty, sumPrices} */
    @GET()
    @route('/:id/order_stats')
    async getOrderStats(req: Request, res: Response){
        try {
            const id = req.params.id;
            const params = req.query;
            const customer = await this.customerService.find(parseInt(id));

            const queryData = await requestOrderStatDTO(params);
            const beforeDate = queryData.beforeDate || null;
            const afterDate = queryData.afterDate || null;

            const stats = await this.customerService.getOrdersStats(customer, getAllStatus(), beforeDate, afterDate);
            const statsFormat = OrderStats(stats) || [];
            res.json(statsFormat);
        }catch(e){
            console.log("error generado...", e);
            this.handleException(e, res);
        }
    }

    /** Obtener clientes registrados {today, week} */
    @GET()
    @route('/stats/registereds')
    async getCustomerRegisters(req: Request, res: Response){
        try {
            const statsToday = await this.customerService.getRegisteredsByRange(moment().startOf('day'), moment().endOf('day'));
            const statsLastWeeks = await this.customerService.getRegisteredsByRange(moment().subtract(1, 'weeks'), moment());
            res.json({"today": statsToday, 'lastWeek': statsLastWeeks});

        }catch(e){
            console.log("error generado...", e);
            this.handleException(e, res);
        }
    }

    getParseGET(entity: Customer, isDetail: boolean): Object {
        if(isDetail){
            return CustomerShowDTO(entity);
        }
        else{
            return CustomerListDTO(entity);
        }
    }

    getParsePOST(entity: Customer): Object {
        return CustomerCreateDTO(entity);
    }

    getParsePUT(entity: Customer): Object {
        return CustomerUpdateDTO(entity);
    }

    protected getDefaultRelations(isDetail: boolean): Array<string> {
        if(isDetail){
            return ['municipality', 'state', 'temporalAddress'];
        } else {
            return ['municipality', 'state'];
        }
    }

    getGroupRelations(): Array<string> {
        return [];
    }


    /** Download Template for Interrapidisimo Delivery Service */
    @route('/gen/customerReport')
    @GET()
    protected async customerReport(req: Request, res: Response){
        try {
            const query = req.query;
            const conditional = query.conditional ? query.conditional + "" : null;
            const offset = query.offset ? query.offset + "" : "0";
            const pageNumber = parseInt(offset);
            const limit = 400000;
            const operation = query.operation ? query.operation + "" : null;
            const group = query.group ? query.group + "" : null;

            const queryCondition = ConditionalQuery.ConvertIntoConditionalParams(conditional);
            const operationQuery = new OperationQuery(operation, group);
            let page = new PageQuery(limit,pageNumber,queryCondition, operationQuery);

            if(!query.operation){
                page.addOrder('id', OrderConditional.DESC);
            }
            const countRegisters = await this.customerService.count(page);

            /** Relations by Default */
            if(this.getDefaultRelations(false)){
                page.setRelations(this.getDefaultRelations(false));
            }

            /** Relations with groups */
            if(this.getGroupRelations() && !isEmpty(group)){
                page.setRelations(this.getGroupRelations());
            }

            let items: Array<Object> = await this.customerOrderService.all(page);

            const response = PageDTO(items || [], countRegisters, pageNumber + 1, limit);

            let exportable = new ExportersCustomers();

            const base64File = await this.mediaManagementService.createExcel(exportable, response.data, res, MEDIA_FORMAT_OUTPUT.b64);
            return res.json({status: 200, data: base64File, name: exportable.getFileName() } );
        }catch(e){
            console.log("error -- ", e.message);
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Clientes no han sido encontrado"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    @route('/get/customersfull')
    @GET()
    protected async getCustomersFull(req: Request, res: Response){
        try {
            const query = req.query;

            const limit = 50000;
            const skip = ((parseInt(query.skip as string) || 1) - 1) * limit;


            const customerOrders: ViewCustomerOrder[] = await this.customerOrderService.findAllWithPage(skip, limit);

            let exportable = new ExportersCustomersFull();

            return await this.mediaManagementService.createExcel(exportable, customerOrders, res, MEDIA_FORMAT_OUTPUT.csv);
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

}
