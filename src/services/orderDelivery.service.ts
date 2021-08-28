import {BaseService} from "../common/controllers/base.service";
import {OrderDelivery} from "../models/OrderDelivery";
import {OrderDeliveryRepository} from "../repositories/orderDelivery.repository";

export class OrderDeliveryService extends BaseService<OrderDelivery> {
    constructor(
        private readonly orderDeliveryRepository: OrderDeliveryRepository<OrderDelivery>
    ){
        super(orderDeliveryRepository);
    }


}
