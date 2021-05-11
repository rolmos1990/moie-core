import {BaseService} from "../common/controllers/base.service";
import {Order as OrderParser} from "../controllers/parsers/order";

import {OrderRepository} from "../repositories/order.repository";
import {OrderDetail} from "../models/OrderDetail";
import {OrderDetailRepository} from "../repositories/orderDetail.repository";
import {OrderProduct} from "../controllers/parsers/orderProduct";
import {ProductSizeService} from "./productSize.service";
import {InvalidArgumentException} from "../common/exceptions";
import {Order} from "../models/Order";
import {CustomerService} from "./customer.service";
import {DeliveryMethod} from "../models/DeliveryMethod";
import {User} from "../models/User";
import {OrderProductTrace} from "../common/helper/orderTrace";
import {existsInEntity} from "../common/helper/helpers";

export class OrderService extends BaseService<Order> {
    constructor(
        private readonly orderRepository: OrderRepository<Order>,
        private readonly  orderDetailRepository: OrderDetailRepository<OrderDetail>,
        private readonly productSizeService: ProductSizeService,
        private readonly customerService: CustomerService
    ) {
        super(orderRepository);
    }

    async updateOrder(parse: OrderDetail[], oldProducts: OrderDetail[], order: Order): Promise<OrderDetail[]> {
        const pmanager = new OrderProductTrace(oldProducts, parse);

        pmanager.process();
        const diferentialProducts = pmanager.getBatches();

        /** Actualizar */
        if (diferentialProducts.updated.length > 0) {
            await this.updateProductDetail(diferentialProducts.updated);
        }

        /** Agregar */
        if (diferentialProducts.added.length > 0) {
            await this.addDetail(diferentialProducts.added);
        }

        /** Eliminar */
        if (diferentialProducts.deleted.length > 0) {
            await this.removeDetail(diferentialProducts.deleted);
        }

        return await this.getDetails(order);
    }

    /**
     * Agregar una orden al modulo de ordenes
     * @param order
     */
    async addOrUpdateOrder(parse: OrderParser, deliveryMethod: DeliveryMethod, user: User, oldOrder: Order) {
        try {
            const customer = await this.customerService.find(parse.customer);

            const order = new Order();

            if (oldOrder) {
                order.id = oldOrder.id;
            }

            order.customer = customer;
            order.origen = parse.origen || order.origen;
            order.chargeOnDelivery = [true, false].includes(parse.chargeOnDelivery) ? parse.chargeOnDelivery : order.chargeOnDelivery;
            order.deliveryType = parse.deliveryType || order.deliveryType;
            order.deliveryCost = parse.deliveryCost || order.deliveryCost;
            order.deliveryMethod = deliveryMethod || order.deliveryMethod;
            order.expiredDate = new Date();
            order.status = order.status || 1;
            order.tracking = order.tracking || "";
            order.remember = order.remember || false;
            order.createdAt = order.createdAt || new Date();

            let products;

            if (!oldOrder) {
                products = await this.getProducts(parse.products, order);
            } else {
                products = oldOrder.orderDetails;
            }

            const costs = await this.getCalculateCosts(products);

            order.totalAmount = (costs.totalAmount - costs.totalDiscount) + (parse.deliveryCost || order.deliveryCost || 0);
            order.subTotalAmount = costs.totalAmount;
            order.totalDiscount = costs.totalDiscount;
            order.totalRevenue = costs.totalRevenue;
            order.totalWeight = costs.totalWeight;
            order.user = order.user || user;
            order.piecesForChanges = parse.piecesForChanges || order.piecesForChanges || null;
            order.paymentMode = parse.paymentMode || order.paymentMode || null;

            const orderRegister = await this.createOrUpdate(order);

            if (!oldOrder) {
                await this.addDetail(products);
            }

            return await this.find(orderRegister.id, ['orderDetails', 'customer', 'deliveryMethod', 'user', 'customer.municipality', 'customer.state']);

        } catch (e) {
            throw e;
        }
    }

    /**
     * Obtener calculo total de ordenes
     * @param order
     */
    async getCalculateCosts(orderDetails: OrderDetail[]) {
        let totalAmount = 0;
        let totalWeight = 0;
        let totalDiscount = 0;
        let totalRevenue = 0;
        orderDetails.map(item => {
            totalWeight = totalAmount + item.weight;
            if (item.discountPercent > 0) {
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
    async getProducts(products: OrderProduct[], order: Order): Promise<OrderDetail[]> {
        const orderDetails: OrderDetail[] = [];
        if (!products || products.length <= 0) {
            throw new InvalidArgumentException("No se ha recibido productos");
        }
        await Promise.all(products.map(async item => {
            if (!item.productSize) {
                throw new InvalidArgumentException("No se ha indicado la talla relacionada a uno de los productos");
            }
            const productSize = await this.productSizeService.find(item.productSize, ['product']);

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

            const beforeOrder = existsInEntity(order.orderDetails, orderDetail);

            if (orderDetail.quantity <= 0) {
                throw new InvalidArgumentException("Verifique las cantidades para producto: " + productSize.product.reference + " (" + productSize.name + ")");
            }

            /** Update order Validation */
            if (beforeOrder.exists) {
                const realQuantity = beforeOrder.value.quantity + productSize.quantity;
                if (realQuantity <= 0 || realQuantity < item.quantity) {
                    throw new InvalidArgumentException("No hay disponibilidad:  - " + productSize.product.reference + " (" + productSize.name + ")");
                }
            } else if (productSize.quantity <= 0 || productSize.quantity < item.quantity) {
                /** New Order Validation */
                throw new InvalidArgumentException("No hay disponibilidad:  - " + productSize.product.reference + " (" + productSize.name + ")");
            }

            orderDetails.push(orderDetail);
        }));
        return orderDetails;
    }

    async addDetail(orderDetails: OrderDetail[]): Promise<OrderDetail[]> {
        let od: OrderDetail[] = [];
        for (let i = 0; i < orderDetails.length; i++) {
            const order: OrderDetail = await this.orderDetailRepository.save(orderDetails[i]);
            od.push(order);
        }
        return od;
    }

    async removeDetail(orderDetails: OrderDetail[]) {
        for (let i = 0; i < orderDetails.length; i++) {
            await this.orderDetailRepository.delete(orderDetails[i]);
        }
    }

    async getDetails(order: Order): Promise<OrderDetail[]> {
        return await this.orderDetailRepository.findBy('order', order, ['product', 'product.productImage']);
    }

    /** Actualizar el detalle de productos */
    async updateProductDetail(updates: any) {
        await Promise.all(updates.map(async item => {
            const orderDetail: OrderDetail = item.orderDetail;
            await this.productSizeService.updateInventary(orderDetail, item.diff);
            /** < 1 Aumente 1 en cantidad de lo anterior */
            if (item.diff < 0) {
                await this.orderDetailRepository.increment(OrderDetail, {
                    color: orderDetail.color,
                    size: orderDetail.size,
                    product: orderDetail.product
                }, 'quantity', Math.abs(item.diff));
            } else {
                await this.orderDetailRepository.decrement(OrderDetail, {
                    color: orderDetail.color,
                    size: orderDetail.size,
                    product: orderDetail.product
                }, 'quantity', item.diff);
            }
        }));
    }
}
