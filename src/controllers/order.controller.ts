import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {Order} from "../models/Order";
import {OrderService} from "../services/order.service";
import {POST, PUT, route} from "awilix-express";
import {OrderCreateDTO, OrderListDTO, OrderShowDTO, OrderUpdateDTO} from "./parsers/order";
import {Request, Response} from "express";
import {InvalidArgumentException} from "../common/exceptions";
import {DeliveryMethod} from "../models/DeliveryMethod";
import {DeliveryMethodService} from "../services/deliveryMethod.service";
import {UserService} from "../services/user.service";
import {OrderDetail} from "../models/OrderDetail";
import {isPaymentMode, PaymentModes} from "../common/enum/paymentModes";
import {OrderProductTrace} from "../common/helper/orderTrace";
import {OrderProduct} from "./parsers/orderProduct";
import { CustomerService } from "../services/customer.service";

@route('/order')
export class OrderController extends BaseController<Order> {
    constructor(
        private readonly orderService: OrderService,
        private readonly deliveryMethodService: DeliveryMethodService,
        private readonly userService: UserService,
        private readonly customerService: CustomerService
    ){
        super(orderService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<Order> {
        return Order;
    }

    getInstance(): Object {
        return new Order();
    }

    async getParseGET(entity: Order, isDetail: false): Promise<Object> {
        if(isDetail){
            const orderDetails: OrderDetail[] = await this.orderService.getDetails(entity);
            entity.orderDetails = orderDetails;
            return OrderShowDTO(entity)
        } else {
            return OrderListDTO(entity);
        }
    }

    getParsePOST(entity: Object): Object {
        return entity;
    }

    getParsePUT(entity: Order): Object {
        return entity;
    }

    /**
     customer: Customer;
     deliveryMethod: string;
     deliveryCost: string;
     chargeOnDelivery: boolean;
     origen: string;
     totalAmount: number;
     totalDiscount: number;
     totalRevenue: number;
     totalWeight: number;
     tracking: string;
     remember: boolean;
     deliveryType : boolean;
     expiredDate: Date;
     createdAt: Date;
     updatedAt: Date;
     status: number;

     * @param req
     * @param res
     */
    @POST()
    public async create(req: Request, res: Response) {
        try {
            const parse = await OrderCreateDTO(req.body);

            const deliveryMethod: DeliveryMethod = await this.deliveryMethodService.findByCode(parse.deliveryMethod);

            if(!(deliveryMethod.settings.includes(parse.deliveryType.toString()))){
                throw new InvalidArgumentException("El tipo de envio es invalido");
            }

            if(![null, undefined].includes(parse.paymentMode) && !isPaymentMode(parse.paymentMode)){
                throw new InvalidArgumentException("El modo de pago es invalido");
            }

            const deliveryCost = await this.deliveryMethodService.deliveryMethodCost(deliveryMethod, parse.products);

            if(deliveryCost.cost > 0){
                parse.deliveryCost = deliveryCost.cost;
            }

            /** TODO -- Asociar usuario a la orden */
            const user = await this.userService.find(1);


            const order: Order = await this.orderService.addOrUpdateOrder(parse, deliveryMethod, user, null);
            const orderDetails: OrderDetail[] = await this.orderService.getDetails(order);
            order.orderDetails = orderDetails;

            return res.json({status: 200 , order: OrderShowDTO(order)});
        }catch(e){
            this.handleException(e, res);
        }
    }

    @route('/nextStatus')
    @POST()
    public async nextStatus(req: Request, res: Response) {
        try {
            const request = req.body;
            if (!request.order) {
                throw new InvalidArgumentException("La orden no ha sido indicada");
            }

            /** LLevar a un servicio que administre los estados */
            /** Entregar al servicio (sesión, orden) */

            const entity = await this.orderService.find(parseInt(request.order));
            if(entity.status === 1){
                entity.status = 2;
            } else if(entity.status === 2){
                entity.status = 3;
            }

            const saved : Order = await this.orderService.createOrUpdate(entity);
            const order: Order = await this.orderService.find(saved.id, this.getDefaultRelations(true));
            const orderDetails: OrderDetail[] = await this.orderService.getDetails(order);
            order.orderDetails = orderDetails;

            return res.json({status: 200, order: OrderShowDTO(order)});

        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    @route('/:id')
    @PUT()
    public async update(req: Request, res: Response) {
        try {
            /** TODO -- Estructurar mejor dentro del servicio */
            const oldEntity = await this.orderService.find(parseInt(req.params.id));
            if(oldEntity) {
                const orderDetails = await this.orderService.getDetails(oldEntity);
                oldEntity.orderDetails = orderDetails;

                //se actualiza inventario
                if(req.body.products && req.body.products.length > 0) {
                    /** Actualización de productos */
                    let parseOrderDetail: OrderDetail[];
                    try {
                        const productRequest = req.body.products.filter((v,i,a)=>a.findIndex(t=>(t.productSize === v.productSize))===i);
                        const newProducts: OrderProduct[] = productRequest.map(item => new OrderProduct(item));
                        parseOrderDetail = await this.orderService.getProducts(newProducts, oldEntity);
                    } catch (e) {
                        throw e;
                    }

                    const orderDetails = await this.orderService.updateOrder(parseOrderDetail, oldEntity.orderDetails, oldEntity);
                    oldEntity.orderDetails = orderDetails;
                }

                const parse = await OrderUpdateDTO(req.body);

                let deliveryMethod: DeliveryMethod;
                if(parse.deliveryMethod) {
                    /** Actualización de metodos de envios */
                    deliveryMethod = await this.deliveryMethodService.findByCode(parse.deliveryMethod);

                    if (!(deliveryMethod.settings.includes(parse.deliveryType.toString()))) {
                        throw new InvalidArgumentException("El tipo de envio es invalido");
                    }

                    const deliveryCost = await this.deliveryMethodService.deliveryMethodCost(deliveryMethod, parse.products);

                    if(deliveryCost.cost > 0){
                        parse.deliveryCost = deliveryCost.cost;
                    }
                }


                if(parse.paymentMode) {
                    /** Actualización de modos de pagos */
                    if (![null, undefined].includes(parse.paymentMode) && !isPaymentMode(parse.paymentMode)) {
                        throw new InvalidArgumentException("El modo de pago es invalido");
                    }
                    oldEntity.paymentMode = parse.paymentMode;
                }

                const order: Order = await this.orderService.addOrUpdateOrder(parse, deliveryMethod, null, oldEntity);
                order.orderDetails = orderDetails;

                return res.json({status: 200, order: OrderShowDTO(order)});
            }
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    protected getDefaultRelations(isDetail): Array<string> {
        if(isDetail) {
            return ['customer', 'deliveryMethod', 'user', 'customer.municipality', 'customer.state'];
        } else {
            return ['customer', 'deliveryMethod', 'orderDetails', 'user', 'customer.municipality', 'customer.state'];
        }
    }
}
