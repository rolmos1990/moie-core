import {GET, POST, PUT, route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {BillService} from "../services/Bill.service";
import {Bill} from "../models/Bill";
import {User} from "../models/User";
import {EntityTarget} from "typeorm";
import {Request, Response} from "express";
import {OrderShowDTO} from "./parsers/order";
import {OrderService} from "../services/order.service";

@route('/bill')
export class BillController extends BaseController<Bill> {
    constructor(
        private readonly billService: BillService,
        private readonly orderService: OrderService
    ){
        super(billService);
    };

    protected afterCreate(item: Object, user: User | undefined): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    @POST()
    public async create(req: Request, res: Response) {
        try {
            const body = req.body;
            const {ids} : any = body;

            if(ids.length > 0 ) {
                /** Buscar las ordenes relacionadas para armar facturas */
                const orders = await this.orderService.findByIdsWithFullRelations(ids);
                const orderBills = await Promise.all(orders.map(item => {
                    return this.billService.generateBill(item);
                }));
                return res.json({status: 200, bills: orderBills});
            } else {
                return res.json({status: 400, error: "No se han encontrado registros"});
            }
        } catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    protected getDefaultRelations(isDetail: boolean): Array<string> {
        return undefined;
    }

    getEntityTarget(): EntityTarget<Bill> {
        return undefined;
    }

    getGroupRelations(): Array<string> {
        return undefined;
    }

    getInstance(): Object {
        return undefined;
    }

    getParseGET(entity: Bill, isDetail: boolean): Object {
        return undefined;
    }

    getParsePOST(entity: Bill): Object {
        return undefined;
    }

    getParsePUT(entity: Bill): Object {
        return undefined;
    }

}
