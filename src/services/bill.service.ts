import {BaseService} from "../common/controllers/base.service";
import {Bill} from "../models/Bill";
import {BillRepository} from "../repositories/bill.repository";
import {Order} from "../models/Order";
import {OrderService} from "./order.service";
import {ConditionalQuery} from "../common/controllers/conditional.query";
import {Operator} from "../common/enum/operators";
import {BillConfig} from "../models/BillConfig";
import {BillConfigRepository} from "../repositories/billConfig.repository";
import {InvalidArgumentException} from "../common/exceptions";
import {BillStatus} from "../common/enum/billStatus";

export class BillService extends BaseService<Bill> {
    constructor(
        private readonly billRepository: BillRepository<Bill>,
        private readonly billConfigRepository: BillConfigRepository<BillConfig>,
        private readonly orderService: OrderService,
    ){
        super(billRepository);
    }

    async getLastNumber() : Promise<any> {

        const lastNumber = this.billRepository.createQueryBuilder('b')
            .select("MAX(b.legal_number)", "max")
        const result = await lastNumber.getRawOne();
        const nexLegalNumber = (result["max"] + 1) || 1;


        const conditional = new ConditionalQuery();
        conditional.add("startNumber", Operator.LESS_OR_EQUAL_THAN, nexLegalNumber);
        conditional.add("finalNumber", Operator.GREATHER_OR_EQUAL_THAN, nexLegalNumber);
        conditional.add("status", Operator.EQUAL, 1);

        const billConfig = await this.billConfigRepository.findByObject(conditional.get());

        if(billConfig.length <= 0){
            throw new InvalidArgumentException("No es posible procesar la siguiente factura");
        }

        return {number: nexLegalNumber, config: billConfig[0]};
    }

    /** Generar una Factura a Partir de una Orden */
    async generateBill(order : Order){

        const hasOrder = await this.findByObject({order});
        if(hasOrder.length === 0) {

            const taxAmount = 19; //Todo -- Llevar a una configuración (Actualmente esta asi).

            const bill = new Bill();
            bill.order = order;
            const getLastNumberInfo = await this.getLastNumber();
            bill.legalNumber = getLastNumberInfo.number;
            bill.tax = taxAmount;
            bill.billConfig = getLastNumberInfo.config;
            bill.status = BillStatus.PENDING;

            return await this.createOrUpdate(bill);
        } else {
            throw new InvalidArgumentException("Orden: " + order.id + ", contiene una factura vigente");
        }
    }
}
