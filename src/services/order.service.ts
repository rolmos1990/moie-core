import {BaseService} from "../common/controllers/base.service";
import {Order} from "../models/Order";
import {OrderRepository} from "../repositories/order.repository";
import {OrderDetail} from "../models/OrderDetail";
import {OrderDetailRepository} from "../repositories/orderDetail.repository";
import {LIMIT_SAVE_BATCH} from "../common/persistence/mysql.persistence";

export class OrderService extends BaseService<Order> {
    constructor(
        private readonly orderRepository: OrderRepository<Order>,
        private readonly  orderDetailRepository: OrderDetailRepository<OrderDetail>
    ){
        super(orderRepository);
    }

    async addDetail(orderDetails: OrderDetail[]) : Promise<OrderDetail[]>{
        let od: OrderDetail[] = [];
        for(let i = 0; i < orderDetails.length ; i++){
            const order : OrderDetail = await this.orderDetailRepository.save(orderDetails[i]);
            od.push(order);
        }
        return od;
    }
}
