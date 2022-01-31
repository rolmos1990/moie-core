import {BaseService} from "../common/controllers/base.service";
import {OrderHistoric} from "../models/OrderHistoric";
import {OrderHistoricRepository} from "../repositories/orderHistoric.repository";
import {Order} from "../models/Order";
import {OrderStatus} from "../common/enum/orderStatus";
import {User} from "../models/User";

export class OrderHistoricService extends BaseService<OrderHistoric> {
    constructor(
        private readonly orderHistoricRepository: OrderHistoricRepository<OrderHistoric>
    ){
        super(orderHistoricRepository);
    }

    /** Agrega una traza o historico a la orden */
    async registerEvent(newOrder: Order, user: User, customStatus : any = false){
        const orderHistoric = new OrderHistoric();
        orderHistoric.order = newOrder;
        orderHistoric.status = !customStatus ? newOrder.status : customStatus;
        orderHistoric.user = user;
        orderHistoric.createdAt = new Date();
        await this.orderHistoricRepository.save(orderHistoric);
    }

}
