import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {Order} from "../models/Order";
import {OrderService} from "../services/order.service";
import {POST, PUT, route} from "awilix-express";
import {OrderCreateDTO} from "./parsers/order";
import {Request, Response} from "express";
import {InvalidArgumentException} from "../common/exceptions";
import {OrderDetail} from "../models/OrderDetail";
import {ProductSizeService} from "../services/productSize.service";

@route('/order')
export class OrderController extends BaseController<Order> {
    constructor(
        private readonly orderService: OrderService,
        private readonly productSizeService: ProductSizeService
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

    getParseGET(entity: Order): Object {
        return entity;
    }

    getParsePOST(entity: Object): Object {
        const entityNew = this.calculateProduct(entity);
        return OrderCreateDTO(entityNew);
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
            const id = req.params.id;
            const body = OrderCreateDTO(req.body);
            const order = new Order();
            order.customer = body.customer;
            order.origen = body.origen;
            order.chargeOnDelivery = body.chargeOnDelivery;
            order.deliveryType = body.deliveryType ? body.deliveryType : 1;
            order.deliveryCost = body.deliveryCost;
            order.deliveryMethod = body.deliveryMethod;
            order.expiredDate = new Date();
            order.status = 1;
            order.totalWeight = 100;
            order.totalRevenue = 100;
            order.totalAmount = 0;
            order.totalDiscount = 0;
            order.tracking = "";
            order.remember = false;
            order.createdAt = new Date();

            const orderDetails : OrderDetail[] = [];
            await Promise.all(body.products.map(async item => {
                const productSize = await this.productSizeService.find(item.productSize, ['product']);
                const orderDetail = new OrderDetail();
                orderDetail.order = order;
                orderDetail.color = productSize.color;
                orderDetail.cost = productSize.product.cost;
                orderDetail.discountPercent = item.discountPercentage;
                orderDetail.price = productSize.product.price || 0;
                orderDetail.quantity = item.quantity;
                orderDetail.revenue = productSize.product.price - productSize.product.cost;
                orderDetail.size = 1;
                orderDetails.push(orderDetail);
            }));
            const orderResponse: Order = await this.orderService.createOrUpdate(order);
            const orderDetailResponse: OrderDetail [] = await this.orderService.addDetail(orderDetails);
            return res.json({status: 200 , order : {...orderResponse, orderDetail: orderDetailResponse}});
        }catch(e){
            this.handleException(e, res);
        }
    }

    calculateProduct(entity: any){
        let newEntity = entity;
        /** Estimar costo de productos */
        newEntity.products = [
            { reference: "E123", discount: 40, color: "blue", "size": "XS"}
        ];
        newEntity.totalAmount = 100;
        return newEntity;
    }

    protected getDefaultRelations(): Array<string> {
        return [];
    }
}
