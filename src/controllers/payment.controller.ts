import {DELETE, GET, POST, route} from 'awilix-express';
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
import {PayuI} from "../common/interfaces/PayuI";
import {PayuRequest} from "../common/requesters/deliveries/PayuRequest";
import {DeliveryStatusImpl, TrackingDelivery} from "../common/requesters/deliveries/DeliveryStatusImpl";

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

    @route('/:id/delete')
    @DELETE()
    protected async deletePayment(req: Request, res: Response){
        try {
            const id = req.params.id;
            const payment = await this.paymentService.find(parseInt(id));
            payment.status = PaymentStatus.CANCELLED;
            await this.paymentService.createOrUpdate(payment);
            return res.json({status: 200 } );
        } catch(e){
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Pago no ha sido encontrado"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);
            }
        }
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
                payment.status = PaymentStatus.CONCILIED;
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

    @route('/gateway/generate/payu/:id')
    @GET()
    protected async generatePayu(req: Request, res: Response){
        try {
        const id = req.params.id;
        const order = await this.orderService.findFull(parseInt(id), ['customer.state', 'customer.municipality']);
        const customer = order.customer;
        const totalAmount = order.totalWithDiscount + order.orderDelivery.deliveryCost;
        const isTest = 0;

        const customerMunicipality = customer.municipality ? customer.municipality.name : '';
        const customerState = customer.state ? customer.state.name  : '';

        const payload : PayuI = {
            id_venta: order.id,
            monto: totalAmount,
            nombre_cliente: customer.name,
            ci_cliente: customer.document,
            telefono_cliente: customer.cellphone,
            direccion: customer.address,
            ciudad: customerMunicipality + ' ' + customerState,
            sandbox: isTest,
        };

        const requested = new PayuRequest(payload);
        const urlResponse = await requested.call();
        return res.json({status: 200, url: urlResponse } );

        } catch(e){
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Orden no ha sido encontrada"), res);
            }
            this.handleException(new ApplicationException(), res);
        }


    }

    @route('/gateway/payu/register')
    @POST()
    protected async registerPayu(req: Request, res: Response){
        try {
            const {
                order, //order_id
                date, //fecha
                value, //monto
                confirmacion, //confirmation code,
                name, //nombre
                email, //email
                phone, //phone
                cc_number, //cc_number
                authorization_code, //codigo de autorizacion
                error_code_bank, //codigo de error de banco
            } = req.body || [];

            const orderObj = await this.orderService.findFull(order);
            if (order) {
                const payment = new Payment();
                payment.order = orderObj;
                payment.createdAt = date;
                payment.email = email;
                payment.name = name;
                payment.phone = phone;
                payment.type = 'Payu';
                payment.consignmentAmount = value;
                payment.consignmentNumber = confirmacion;

                const _newPayment = await this.paymentService.createOrUpdate(payment);

                orderObj.status = OrderStatus.RECONCILED;
                orderObj.payment = _newPayment.id;

                await this.orderService.createOrUpdate(orderObj);

                return res.json({status: 200});
            }
        }catch(e){
            this.handleException(new ApplicationException(), res);
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
