import {BaseService} from "../common/controllers/base.service";
import {OfficeRepository} from "../repositories/office.repository";
import {Office} from "../models/Office";
import {Order} from "../models/Order";
import {OrderRepository} from "../repositories/order.repository";
import {OfficeReportTypes} from "../common/enum/officeReportTypes";
import {DeliveryTypes} from "../common/enum/deliveryTypes";

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
        let orders;
        if(type == OfficeReportTypes.MENSAJERO){
            orders = await this.orderRepository.createQueryBuilder('o')
                .leftJoinAndSelect('o.office', 'b')
                .leftJoinAndSelect('o.orderDelivery', 'od')
                .where("o.dateOfSale = :dateFrom", { dateFrom: date })
                .andWhere("o.deliveryMethod != :deliveryMethod", {deliveryMethod: "MENSAJERO"})
                .andWhere("od.deliveryType = :deliveryType", {deliveryType: DeliveryTypes.PREVIOUS_PAYMENT})
                .getMany();
        } else {
            orders = await this.orderRepository.createQueryBuilder('o')
                .leftJoinAndSelect('o.office', 'b')
                .leftJoinAndSelect('o.orderDelivery', 'od')
                .where("o.dateOfSale = :dateFrom", { dateFrom: date })
                .andWhere("o.deliveryMethod = :deliveryMethod", {deliveryMethod: "MENSAJERO"})
                .getMany();
        }

        return orders;

    }
}
