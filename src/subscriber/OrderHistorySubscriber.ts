import {EventSubscriber} from "typeorm";
import {Order} from "../models/Order";
import {OrderHistory} from "../models/History/OrderHistory";
import {HistorySubscriber} from "typeorm-revisions";


@EventSubscriber()
class OrderHistorySubscriber extends HistorySubscriber<Order, OrderHistory> {
    public get entity() {
        return Order;
    }
    public get historyEntity() {
        return OrderHistory;
    }
}
