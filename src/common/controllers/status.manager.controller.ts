import {Order} from "../../models/Order";
import {OrderStatus} from "../enum/orderStatus";
import {builderOrderTypes} from "../enum/orderTypes";
import {OrderRepository} from "../../repositories/order.repository";
import {User} from "../../models/User";
import {OrderHistoric} from "../../models/OrderHistoric";
import {OrderHistoricService} from "../../services/orderHistoric.service";
import {EventStatus} from "../enum/eventStatus";

export class StatusManagerController {

    readonly _statusHistoric : OrderHistoric[];

    constructor(
        protected readonly order: Order,
        protected readonly service: OrderRepository<Order>,
        protected readonly user?: User,
        protected readonly historyService?: OrderHistoricService
        ) {
        this._statusHistoric = [];
    };

    async save() {
        await this.service.save(this.order);
        if(this.hasHistory()){
            await this.historyService.createOrUpdateMany(this._statusHistoric);
        }
    }

    async start() {
        this.order.modifiedDate = new Date();
        this.order.payment = null;
        this.order.office = null;
        this.setStatus(OrderStatus.PENDING);

        await this.save();
    }

    setStatus(_status: OrderStatus){
        this.order.status = _status;
        if(this.historyService) {
            //add history
            const _history = new OrderHistoric();
            _history.createdAt = new Date();
            _history.order = this.order;
            _history.user = this.user;
            _history.status = this.order.status;
            this._statusHistoric.push(_history);
        }
    }

    hasHistory(){
        if(!this.historyService){
            return false;
        }
        return  this._statusHistoric.length > 0;
    }

    getNextStatus(order: Order) {

        const _orderType = builderOrderTypes(order);

        /*** Previo Pago */
        if (order.isPreviousPayment()) {
            if (order.isReconcilied()) {
                this.order.prints = (this.order.prints + 1) || 1;
                this.setStatus(OrderStatus.PRINTED);
            }
            else if (order.isPrinted()) {
                if (_orderType.isMensajero() || _orderType.isOtro() || _orderType.isInterrapidisimo()) {
                    this.setStatus(OrderStatus.SENT);
                    this.setStatus(OrderStatus.FINISHED);
                }
            }
            else if (order.isPending()) {
                this.order.dateOfSale = new Date();
                this.setStatus(OrderStatus.RECONCILED);
            }
            return;
        }

        /*** Contra Pago */
        if (!order.isPreviousPayment()) {
            if (order.isSent()) {
                if (_orderType.isInterrapidisimo() || _orderType.isMensajero()) {
                    this.setStatus(OrderStatus.RECONCILED);
                    this.setStatus(OrderStatus.FINISHED);
                } else {
                    this.setStatus(OrderStatus.FINISHED);
                }
            }
            else if (order.isConfirmed()) {
                this.order.prints = (this.order.prints + 1) || 1;
                this.setStatus(OrderStatus.PRINTED);
            }
            else if (order.isPrinted()) {
                if (_orderType.isMensajero() || _orderType.isInterrapidisimo()) {
                    this.setStatus(OrderStatus.SENT);
                }  else if(_orderType.isOtro()){
                    this.setStatus(OrderStatus.SENT);
                    this.setStatus(OrderStatus.FINISHED);
                }
            }
            else if (order.isPending()) {
                this.order.dateOfSale = new Date();
                this.setStatus(OrderStatus.CONFIRMED);
            }
                return;
            }
    }

    async restart() {
        this.order.status = OrderStatus.PENDING;
        if(this.historyService) {
            //add history
            const _history = new OrderHistoric();
            _history.createdAt = new Date();
            _history.order = this.order;
            _history.user = this.user;
            _history.status = EventStatus.UPDATED;
            this._statusHistoric.push(_history);
        }
        await this.save();
    }

    async next() {
        if (!this.order.isFinished()) {
            this.getNextStatus(this.order);
            await this.save();
        }
    }

    async cancel() {
        if (!this.order.isFinished()) {
            this.setStatus(OrderStatus.CANCELED);
            await this.save();
        }
    }

    getOrder(): Order {
        return this.order;
    }
}
