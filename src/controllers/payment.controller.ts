import {POST, route} from 'awilix-express';
import {PaymentService} from "../services/payment.service";
import {BaseController} from "../common/controllers/base.controller";
import {Payment} from "../models/Payment";
import {EntityTarget} from "typeorm";
import {PaymentCreateDTO} from "./parsers/payment";
import {Request, Response} from "express";
import {IProductSize} from "../common/interfaces/IProductSize";
import {Product} from "../models/Product";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {OrderService} from "../services/order.service";
import {OrderStatus} from "../common/enum/orderStatus";

@route('/payment')
export class PaymentController extends BaseController<Payment> {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService
    ){
        super(paymentService);
    };

    public getInstance() : Payment{
        return new Payment();
    }

    getParseGET(entity: Payment): Object {
        return entity;
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

                const order = await this.orderService.find(orderId);
                const paymentId = await this.paymentService.find(parseInt(id));

                order.status = OrderStatus.RECONCILED;
                order.payment = paymentId;
                await this.orderService.update(order);

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

    protected getDefaultRelations(): Array<string> {
        return [];
    }
    getGroupRelations(): Array<string> {
        return [];
    }
}
