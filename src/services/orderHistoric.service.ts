import {BaseService} from "../common/controllers/base.service";
import {OrderHistoric} from "../models/OrderHistoric";
import {OrderHistoricRepository} from "../repositories/orderHistoric.repository";

export class OrderHistoricService extends BaseService<OrderHistoric> {
    constructor(
        private readonly orderHistoricRepository: OrderHistoricRepository<OrderHistoric>
    ){
        super(orderHistoricRepository);
    }


}
