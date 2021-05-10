import {BaseService} from "../common/controllers/base.service";
import {Order as OrderParser} from "../controllers/parsers/order";

import {OrderRepository} from "../repositories/order.repository";
import {OrderDetail} from "../models/OrderDetail";
import {OrderDetailRepository} from "../repositories/orderDetail.repository";
import {LIMIT_SAVE_BATCH} from "../common/persistence/mysql.persistence";
import {OrderProduct} from "../controllers/parsers/orderProduct";
import {ProductSizeService} from "./productSize.service";
import {InvalidArgumentException} from "../common/exceptions";
import {OrderCreateDTO} from "../controllers/parsers/order";
import {Order} from "../models/Order";
import {CustomerService} from "./customer.service";
import {DeliveryMethod} from "../models/DeliveryMethod";
import {IProductDetail} from "../common/interfaces/IProductSize";
import {Product} from "../models/Product";
import {User} from "../models/User";

export class OrderService extends BaseService<Order> {
    constructor(
        private readonly orderRepository: OrderRepository<Order>,
        private readonly  orderDetailRepository: OrderDetailRepository<OrderDetail>,
        private readonly productSizeService: ProductSizeService,
        private readonly customerService: CustomerService,
    ){
        super(orderRepository);
    }

    /**
     * Agregar una orden al modulo de ordenes
     * @param order
     */
    async addOrder(parse: OrderParser, deliveryMethod: DeliveryMethod, user: User){
        try {
            const customer = await this.customerService.find(parse.customer);

            const order = new Order();
            order.customer = customer;
            order.origen = parse.origen;
            order.chargeOnDelivery = parse.chargeOnDelivery;
            order.deliveryType = parse.deliveryType;
            order.deliveryCost = parse.deliveryCost;
            order.deliveryMethod = deliveryMethod;
            order.expiredDate = new Date();
            order.status = 1;
            order.tracking = "";
            order.remember = false;
            order.createdAt = new Date();

            const products = await this.getProducts(parse.products, order);

            const costs = await this.getCalculateCosts(products);

            order.totalAmount = (costs.totalAmount - costs.totalDiscount) + parse.deliveryCost;
            order.subTotalAmount = costs.totalAmount;
            order.totalDiscount = costs.totalDiscount;
            order.totalRevenue = costs.totalRevenue;
            order.totalWeight = costs.totalWeight;
            order.user = user;
            order.piecesForChanges = parse.piecesForChanges || null;
            order.paymentMode = parse.paymentMode || null;

            const orderRegister = await this.createOrUpdate(order);
            await this.addDetail(products);

            return await this.find(orderRegister.id, ['orderDetails', 'customer', 'deliveryMethod', 'user']);

        }catch(e){
            throw e;
        }
    }

    /**
     * Obtener calculo total de ordenes
     * @param order
     */
    async getCalculateCosts(orderDetails: OrderDetail[]){
        let totalAmount = 0;
        let totalWeight = 0;
        let totalDiscount = 0;
        let totalRevenue = 0;
        orderDetails.map(item => {
           totalWeight = totalAmount + item.weight;
           if(item.discountPercent > 0) {
               totalDiscount = totalDiscount + ((item.price * item.discountPercent) / 100);
           } else {
               totalDiscount = 0;
           }
           totalAmount = totalAmount + item.price;
           totalRevenue = totalRevenue + item.revenue;
        });

        return {
            totalAmount,
            totalWeight,
            totalDiscount,
            totalRevenue
        };
    }

    /**
     * Obtener lista de productos de un request de productos
     * */
    async getProducts(products: OrderProduct[],order: Order) : Promise<OrderDetail[]> {
        const orderDetails : OrderDetail[] = [];
        await Promise.all(products.map(async item => {
            if(!item.productSize){
                throw new InvalidArgumentException("No podemos encontrar el producto indicado");
            }
            const productSize = await this.productSizeService.find(item.productSize, ['product']);
            /** Validar cantidad de productos */
            if(productSize.quantity <= 0){
                throw new InvalidArgumentException("No hay disponibilidad:  - " + productSize.product.reference + " ("+productSize.name+")");
            }

            const orderDetail = new OrderDetail();
            orderDetail.order = order;
            orderDetail.color = productSize.color;
            orderDetail.cost = productSize.product.cost;
            orderDetail.discountPercent = item.discountPercentage;
            orderDetail.price = productSize.product.price || 0;
            orderDetail.quantity = item.quantity;
            orderDetail.revenue = productSize.product.price - productSize.product.cost;
            orderDetail.weight = productSize.product.weight;
            orderDetail.size = productSize.name;
            orderDetail.product = productSize.product;
            orderDetails.push(orderDetail);
        }));
        return orderDetails;
    }

    async addDetail(orderDetails: OrderDetail[]) : Promise<OrderDetail[]>{
        let od: OrderDetail[] = [];
        for(let i = 0; i < orderDetails.length ; i++){
            const order : OrderDetail = await this.orderDetailRepository.save(orderDetails[i]);
            od.push(order);
        }
        return od;
    }

    async getDetails(order: Order) : Promise<OrderDetail[]>{
        return await this.orderDetailRepository.findBy('order', order, ['product','product.productImage']);
    }
}
