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
    RequestStats,
    Stats
} from "./parsers/customer";
import { PageQuery } from "../common/controllers/page.query";
import {Request, Response} from "express";
import {InvalidArgumentException} from "../common/exceptions";
import {getAllStatus} from "../common/enum/orderStatus";
import moment = require("moment");

@route('/customer')
export class CustomerController extends BaseController<Customer> {
    constructor(
        private readonly customerService: CustomerService
    ){
        super(customerService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
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
            const customersEntities = await this.customerService.whereIn(customers);
            if (customers && customersEntities.length > 0) {
                const orders = await this.customerService.getOrdersFinishedForCustomers(customersEntities);
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
}
