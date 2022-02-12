import {BaseService} from "../common/controllers/base.service";
import {OfficeRepository} from "../repositories/office.repository";
import {Office} from "../models/Office";
import {Order} from "../models/Order";
import {OrderRepository} from "../repositories/order.repository";
import {OfficeReportTypes} from "../common/enum/officeReportTypes";
import {DeliveryTypes} from "../common/enum/deliveryTypes";
import moment = require("moment");

export class OfficeService extends BaseService<Office> {
    constructor(
        private readonly officeRepository: OfficeRepository<Office>,
        private readonly orderRepository: OrderRepository<Order>
    ){
        super(officeRepository);
    }

    getRepository(){
        return this.officeRepository;
    }

    /** Reporte basado en Facturación */
    async getDataForReport(date, type){
        const MENSAJERO = 2;
        let orders;
        const PreviusPaymentAndChargeOnDelivery = [DeliveryTypes.PREVIOUS_PAYMENT, DeliveryTypes.CHARGE_ON_DELIVERY];
        const previusPayments = [DeliveryTypes.PREVIOUS_PAYMENT, DeliveryTypes.PAY_ONLY_DELIVERY];
        //Mensajero previo pago y mensajero contrapago
        orders = await this.orderRepository.createQueryBuilder('o')
            .leftJoinAndSelect('o.office', 'b')
            .leftJoinAndSelect('o.orderDelivery', 'od')
            .andWhere("o.office IS NOT NULL")
            .andWhere("DATE(o.dateOfSale) = DATE(:dateFrom)")
            .andWhere("od.deliveryType IN (:deliveryTypes)")
            .andWhere("o.deliveryMethod = :deliveryMethod")
            .setParameters({deliveryMethod: MENSAJERO, deliveryTypes: PreviusPaymentAndChargeOnDelivery, dateFrom: date})
            .getMany();
        if(type == OfficeReportTypes.MENSAJERO){
        } else {
            //Previo Pago y Previo Pago COD que no tenga mensajero
            orders = await this.orderRepository.createQueryBuilder('o')
                .leftJoinAndSelect('o.office', 'b')
                .leftJoinAndSelect('o.orderDelivery', 'od')
                .andWhere("o.office IS NOT NULL")
                .andWhere("DATE(o.createdAt) = DATE(:dateFrom)")
                .andWhere('od.deliveryType IN (:deliveryTypes)')
                .andWhere("o.deliveryMethod != :deliveryMethod")
                .setParameters({deliveryMethod: MENSAJERO, deliveryTypes: previusPayments, dateFrom: date})
                .getMany();
        }

        return orders;

    }
}
