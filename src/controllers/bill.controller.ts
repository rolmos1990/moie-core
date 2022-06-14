import {GET, POST, route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {BillService} from "../services/bill.service";
import {Bill} from "../models/Bill";
import {User} from "../models/User";
import {EntityTarget} from "typeorm";
import {Request, Response} from "express";
import {OrderService} from "../services/order.service";
import {BillListDTO} from "./parsers/bill";
import {EBillType} from "../common/enum/eBill";
import {BillStatus} from "../common/enum/billStatus";
import {InvalidMunicipalityException} from "../common/exceptions/invalidMunicipality.exception";
import {InvalidDocumentException} from "../common/exceptions/invalidDocument.exception";
import {InvalidArgumentException} from "../common/exceptions";
import {MEDIA_FORMAT_OUTPUT, MediaManagementService} from "../services/mediaManagement.service";
import {ElectronicBillAdaptor} from "../templates/adaptors/ElectronicBillAdaptor";
import {ExpotersEletronicBill} from "../templates/exporters/electronic-bill";
import {BillCreditMemo} from "../models/BillCreditMemo";

const moment = require("moment");

@route('/bill')
export class BillController extends BaseController<Bill> {
    constructor(
        private readonly billService: BillService,
        private readonly orderService: OrderService,
        private readonly mediaManagementService: MediaManagementService
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

    /** Generar las facturas de ordenes */
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

    /** Recarga facturas pendientes */
    @route('/reload/dian')
    @GET()
    public async reloadBills(req: Request, res: Response){
        const bills = await this.billService.findByStatus(BillStatus.PENDING);
        await Promise.all(bills.map(async bill => {
            try {
                await this.billService.sendElectronicBill(bill, EBillType.INVOICE, false);
                bill.status = BillStatus.SEND;
                await this.billService.createOrUpdate(bill);
            }catch(e){
                console.log("error to send: ", e.message);

                if(e instanceof InvalidMunicipalityException){
                    bill.status = BillStatus.NO_MUNICIPALITY
                }
                else if(e instanceof InvalidDocumentException){
                    bill.status = BillStatus.NO_IDENTITY
                } else {
                    bill.status = BillStatus.ERROR
                }

                await this.billService.createOrUpdate(bill);
            }
        }));
        return res.json({status: 200});
    }

    @route('/creditMemo/:id')
    @POST()
    public async cancelBill(req: Request, res: Response){
        const id = req.params.id;
        const {type} = req.body;
        let billMemo = null;

        try {
        const bill = await this.billService.findBill(id);
        const hasSomeMemo = bill.creditMemo && bill.creditMemo.status == true;

        if(bill.status !== BillStatus.SEND || hasSomeMemo){
            throw new InvalidArgumentException("La solicitud no puede ser generada");
        }

        const memotype : EBillType = type;

        if(bill.creditMemo != null) {
            billMemo = bill.creditMemo;
        } else {
            billMemo = await this.billService.createMemo(bill, memotype);
            bill.creditMemo = billMemo;
        }

        const resp = await this.billService.sendElectronicBill(bill, memotype, false, billMemo);

        if(resp == true) {
            bill.creditMemo.status = true;
            await this.billService.updateMemo(bill.creditMemo);
            return res.json({status: 200, billCreditMemo: bill.creditMemo});
        }
            bill.creditMemo.bill = null;
            return res.json({status: 200, billCreditMemo: bill.creditMemo});


        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    @route('/gen/billReport')
    @GET()
    public async billReport(req: Request, res: Response){
        const {dateFrom, dateTo, type} = req.query;
        try {

            if(!(type === EBillType.CREDIT || type === EBillType.INVOICE || type === EBillType.INVOICE_CLASSIC)){
                throw new InvalidArgumentException("Tipo no valido");
            }

            const bills: Bill[] = await this.billService.getDataForReport(dateFrom, dateTo, type === EBillType.CREDIT);

            const exportable = new ExpotersEletronicBill();
            exportable.setType(type);

            const billsAdaptor = new ElectronicBillAdaptor(bills);

            const base64File = await this.mediaManagementService.createExcel(exportable, billsAdaptor, res, MEDIA_FORMAT_OUTPUT.b64);
            return res.json({status: 200, data: base64File, name: exportable.getFileName() } );

            console.log("asd");
            return res.json({status: 200});
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    protected getDefaultRelations(isDetail: boolean): Array<string> {
        return ['order', 'order.customer','billConfig', 'creditMemo'];
    }

    getEntityTarget(): EntityTarget<Bill> {
        return Bill;
    }

    getGroupRelations(): Array<string> {
        return undefined;
    }

    getInstance(): Object {
        return undefined;
    }

    getParseGET(entity: Bill, isDetail: boolean): Object {
        return BillListDTO(entity);
    }

    getParsePOST(entity: Bill): Object {
        return BillListDTO(entity);
    }

    getParsePUT(entity: Bill): Object {
        return BillListDTO(entity);
    }

}
