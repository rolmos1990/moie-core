import {POST, route} from 'awilix-express';
import {PaymentService} from "../services/payment.service";
import {BaseController} from "../common/controllers/base.controller";
import {Payment} from "../models/Payment";
import {EntityTarget} from "typeorm";
import {PaymentCreateDTO, PaymentDetailDTO} from "./parsers/payment";
import {Request, Response} from "express";
import {IProductSize} from "../common/interfaces/IProductSize";
import {Product} from "../models/Product";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {OrderService} from "../services/order.service";
import {OrderStatus} from "../common/enum/orderStatus";
import {OrderHistoricService} from "../services/orderHistoric.service";
import {UserService} from "../services/user.service";
import {DeliveryTypes} from "../common/enum/deliveryTypes";
import {PaymentStatus} from "../common/enum/paymentStatus";

@route('/payment')
export class PaymentController extends BaseController<Payment> {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService,
        private readonly orderHistoricService: OrderHistoricService,
        protected readonly userService: UserService
    ){
        super(paymentService);
    };

    public getInstance() : Payment{
        return new Payment();
    }

    getParseGET(entity: Payment, isDetail): Object {
        if(isDetail){
            return PaymentDetailDTO(entity);
        }else{
            return entity;
        }
    }

    getParsePOST(entity: Payment): Object {
        return PaymentCreateDTO(entity);
    }

    getParsePUT(entity: Payment): Object {
        return entity;
    }

    public getEntityTarget(): EntityTarget<any> {
        return Payment;
    }

    @route('/applyPayment/:id')
    @POST()
    protected async applyPayment(req: Request, res: Response){
        try {
            const id = req.params.id;
            const {orderId} = req.body || [];
            if (orderId && id) {
                const user = await this.userService.find(req["user"]);
                const order = await this.orderService.find(orderId, ['orderDelivery']);
                //await this.orderService.update(order);
                const payment = await this.paymentService.find(parseInt(id));
                order.payment = payment;

                //register payment and update payment in order
                await this.paymentService.createOrUpdate(payment);
                await this.orderService.createOrUpdate(order);

                //update status for order
                await this.orderService.updateNextStatus(order, user);

                return res.json({status: 200 } );
            } else {
                throw new InvalidArgumentException();
            }
        }catch(e){
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Orden no ha sido encontrada"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    protected beforeCreate(item: Payment){}
    protected afterCreate(item: Object): void {}
    protected afterUpdate(item: Object): void {}
    protected beforeUpdate(item: Object): void {}

    protected getDefaultRelations(isDetail= false): Array<string> {
        if(isDetail){
            return ['order','order.customer','order.orderDelivery']
        } else {
            return [];
        };
    }
    getGroupRelations(): Array<string> {
        return [];
    }
}
