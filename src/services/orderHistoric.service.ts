import {BaseService} from "../common/controllers/base.service";
import {OrderHistoric} from "../models/OrderHistoric";
import {OrderHistoricRepository} from "../repositories/orderHistoric.repository";
import {Order} from "../models/Order";
import {OrderStatus} from "../common/enum/orderStatus";
import {User} from "../models/User";
import {EventStatus} from "../common/enum/eventStatus";
import {OrderRepository} from "../repositories/order.repository";

export class OrderHistoricService extends BaseService<OrderHistoric> {
    constructor(
        private readonly orderHistoricRepository: OrderHistoricRepository<OrderHistoric>,
        private readonly orderRepository: OrderRepository<Order>
    ){
        super(orderHistoricRepository);
    }

    /** Agrega una traza o historico a la orden */
    async registerEvent(newOrder: Order, user: User, customStatus : any = false){

        const canRegister = await this.checkIfOrderIsFinished(newOrder, user, customStatus);
        if(!canRegister){
            return;
        }

        /** Refresh order status */
        if(customStatus === EventStatus.UPDATED){
            newOrder.status = OrderStatus.PENDING;
            await this.orderRepository.save(newOrder);
        }

        /** Update History order status */
        const orderHistoric = new OrderHistoric();
        orderHistoric.order = newOrder;
        orderHistoric.status = !customStatus ? newOrder.status : customStatus;
        orderHistoric.user = user;
        orderHistoric.createdAt = new Date();
        await this.orderHistoricRepository.save(orderHistoric);
    }

    async checkIfOrderIsFinished(order: Order, user: User, customStatus: any){
        //PrevioPago/Otro con Numero de Guia (Estado Impreso)
        if(order.hasTracking() && order.isPrinted() && order.isPreviousPayment()){
            order.status = OrderStatus.FINISHED;
            await this.orderRepository.save(order);
            await this.registerEvent(order, user, EventStatus.SENT);
            await this.registerEvent(order, user, EventStatus.FINISHED);
            return false;
        }

        return true;
    }

}
