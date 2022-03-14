import {BaseService} from "../common/controllers/base.service";
import {OrderUpdate as OrderParserUpdate} from '../controllers/parsers/order';

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
import {existsInEntity, string_to_slug} from "../common/helper/helpers";
import {ProductSize} from "../models/ProductSize";
import {Product} from "../models/Product";
import {OrderDelivery} from "../models/OrderDelivery";
import {OrderDeliveryRepository} from "../repositories/orderDelivery.repository";
import {DeliveryTypes, getDeliveryType} from "../common/enum/deliveryTypes";
import {DeliveryMethodService} from "./deliveryMethod.service";
import {Office} from "../models/Office";
import {DeliveryLocalityService} from "./deliveryLocality.service";
import {Between, IsNull, Not} from "typeorm";
import {OfficeReportTypes} from "../common/enum/officeReportTypes";
import {TemplatesRegisters} from "../common/enum/templatesTypes";
import {DeliveryStatus} from "../common/enum/deliveryStatus";
import {OrderStatus} from "../common/enum/orderStatus";
import {FieldOptionService} from "./fieldOption.service";

export class OrderService extends BaseService<Order> {
    constructor(
        private readonly orderRepository: OrderRepository<Order>,
        private readonly  orderDetailRepository: OrderDetailRepository<OrderDetail>,
        private readonly  orderDeliveryRepository: OrderDeliveryRepository<OrderDelivery>,
        private readonly productSizeService: ProductSizeService,
        private readonly customerService: CustomerService,
        private readonly deliveryMethodService: DeliveryMethodService,
        private readonly deliveryLocalityService: DeliveryLocalityService,
        private readonly fieldOptionService: FieldOptionService
    ) {
        super(orderRepository);
    }

    async update(_order: Order) : Promise<Order>{
        const order = await this.createOrUpdate(_order);
        return order;
    }

    async updateOrder(parse: OrderDetail[], oldProducts: OrderDetail[], order: Order): Promise<OrderDetail[]> {
        const pmanager = new OrderProductTrace(oldProducts, parse);

        pmanager.process();
        const diferentialProducts = pmanager.getBatches();

        /** Eliminar */
        if (diferentialProducts.deleted.length > 0) {
            try {
                await this.removeDetail(diferentialProducts.deleted);
            }catch(e){
                console.log("ERROR REMOVED ORDER", e.message);
            }
        }

        /** Actualizar */
        if (diferentialProducts.updated.length > 0) {
            try {
            await this.updateProductDetail(diferentialProducts.updated);
            }catch(e){
                console.log("ERROR UPDATED ORDER");
            }
        }

        /** Agregar */
        if (diferentialProducts.added.length > 0) {
            try {
            await this.addDetail(diferentialProducts.added);
            }catch(e){
                console.log("ERROR ADDED ORDER");
            }
        }

        return await this.getDetails(order);
    }

    /**
     * Agregar una orden al modulo de ordenes
     * @param order
     */
    async addOrUpdateOrder(parse: OrderParserUpdate , deliveryMethod: DeliveryMethod, user: User, oldOrder: Order, updateAddress = false) {
        try {
            const customer = await this.customerService.find(parse.customer || oldOrder.customer.id, ['state', 'municipality']);

            const order = new Order();

            let orderDelivery = new OrderDelivery();
            if(oldOrder && oldOrder.id) {
                orderDelivery = await this.orderDeliveryRepository.findOneByObject({order: oldOrder});
            }

            order.orderDelivery = orderDelivery;

            if (oldOrder) {
                order.id = oldOrder.id;
            }

            const deliveryCost = parse.deliveryCost || order.orderDelivery.deliveryCost || 0;

            order.customer = customer;
            order.origen = parse.origen || order.origen;
            order.expiredDate = new Date();
            order.status = order.status || 1;
            order.remember = order.remember || false;
            order.createdAt = order.createdAt || new Date();
            order.office = null;

            /** Delivery Information in Order */
            order.orderDelivery.chargeOnDelivery = [true, false].includes(parse.chargeOnDelivery) ? parse.chargeOnDelivery : order.orderDelivery.chargeOnDelivery;
            order.orderDelivery.deliveryType = parse.deliveryType || order.orderDelivery.deliveryType;
            order.orderDelivery.deliveryCost = deliveryCost || 0;
            order.deliveryMethod = deliveryMethod || order.deliveryMethod;
            order.orderDelivery.tracking = order.orderDelivery.tracking || null;

            if(parse.deliveryLocality) {
                const deliveryLocality = await this.deliveryLocalityService.find(parse.deliveryLocality);
                order.orderDelivery.deliveryLocality = deliveryLocality;
            }

            let products;

            if (!oldOrder) {
                products = await this.getProducts(parse.products, order);
            } else {
                products = oldOrder.orderDetails;
            }

            const costs = await this.getCalculateCosts(products);

            order.totalAmount = (costs.totalAmount - costs.totalDiscount) + Number(deliveryCost);
            order.subTotalAmount = costs.totalAmount;
            order.totalDiscount = costs.totalDiscount;
            order.totalRevenue = costs.totalRevenue;
            order.totalWeight = costs.totalWeight;
            order.user = (oldOrder && oldOrder.user) || order.user || user;
            order.piecesForChanges = parse.piecesForChanges || order.piecesForChanges || null;
            order.paymentMode = parse.paymentMode || order.paymentMode || null;
            order.photos = parse.photos || order.photos || 0;
            order.prints = parse.prints || order.prints || 0;
            order.quantity = products.reduce((s,p) => p.quantity + s, 0);

            //Incremento prioridad de la orden cada vez que la actualizo (solo si la orden es pendiente obtiene prioridad)
            if((order && order.status === 1) && oldOrder){
                order.modifiedDate = new Date();
            } else if(!oldOrder){
                order.modifiedDate = new Date();
            }
            const orderRegister = await this.createOrUpdate(order);

            order.orderDelivery.order = orderRegister;

            const orderDeliveryRegistered = await this.orderDeliveryRepository.save(order.orderDelivery);
            orderRegister.orderDelivery = orderDeliveryRegistered;

            await this.orderRepository.save(orderRegister);

            //Actualizar cliente como mayorista
            try {
                await this.customerService.isMayorist(customer, order.quantity, true);
            }catch(e){
                console.log("No se actualizo mayorista", e.message);
            }

            if (!oldOrder) {
                await this.addDetail(products);
                await this.updateInventaryForOrderDetail(products, false);
            }

            return await this.find(orderRegister.id, ['orderDetails', 'customer', 'deliveryMethod', 'user', 'customer.municipality', 'customer.state', 'orderDelivery']);

        } catch (e) {
            throw e;
        }
    }

    /**
     * Obtener calculo total de ordenes
     * @param order
     */
    async getCalculateCosts(orderDetails: OrderDetail[]) {
        let totalAmount : number = 0;
        let totalWeight : number = 0;
        let totalDiscount = 0;
        let totalRevenue = 0;
        orderDetails.map(item => {
            totalWeight += Number(item.weight) * Number(item.quantity);
            if (item.discountPercent > 0) {
                totalDiscount += ((Number(item.price) * Number(item.discountPercent)) / 100) * Number(item.quantity);
            } else {
                totalDiscount = 0;
            }
            totalAmount += Number(item.price) * Number(item.quantity);
            totalRevenue += Number(item.revenue);
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
            orderDetail.productSize = productSize;

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
            delete orderDetails[i].productSize;
            await this.orderDetailRepository.delete(orderDetails[i]);
        }
    }

    async getDetails(order: Order): Promise<OrderDetail[]> {
        return await this.orderDetailRepository.createQueryBuilder('orderDetail')
            .where('orderDetail.order = :value', {value: order.id})
            .leftJoinAndSelect('orderDetail.product', 'p')
            .leftJoinAndSelect('p.productImage', 'pi')
            .leftJoinAndMapOne('orderDetail.productSize', ProductSize,'ps', 'ps.color = orderDetail.color and ps.name = orderDetail.size and ps.product = orderDetail.product')
            .innerJoin('orderDetail.product', 'product')
            .getMany();
    }

    async getOrderDetailByProductIdAndStatuses(productId, orderStatus: any) {
        return await this.orderDetailRepository.createQueryBuilder('orderDetail')
            .leftJoinAndSelect('orderDetail.order', 'o')
            .leftJoinAndSelect('o.customer', 'c')
            .where('orderDetail.product = :product', {product: productId})
            .andWhere('o.status IN (:orderStatus)', {orderStatus: orderStatus})
            .getMany();
    }

    /** Descontar de inventario (Creacion de producto) */
    async updateInventaryForOrderDetail(orderDetails: OrderDetail[], increment = false) {
        await Promise.all(orderDetails.map(async item => {
            const orderDetail: OrderDetail = item;
            await this.productSizeService.updateInventary(orderDetail, increment ? orderDetail.quantity : orderDetail.quantity * -1);
        }));
    }

    /** Actualizar el detalle de productos */
    async updateProductDetail(updates: any) {
        await Promise.all(updates.map(async item => {
            const orderDetail: OrderDetail = item.orderDetail;
            await this.productSizeService.updateInventary(orderDetail, item.diff);

            await this.orderDetailRepository.update(orderDetail.id, {
                color: orderDetail.color,
                discountPercent: orderDetail.discountPercent,
                quantity: orderDetail.quantity,
                revenue: orderDetail.revenue,
                size: orderDetail.size
            });
        }));
    }

    /**
     * @param Order order
     * Obtener plantilla dependiendo de la orden
     */
    getBoardRuleTemplate(order: Order) {
        const aliasFree = order.orderDelivery.deliveryCost == 0 ? 'FREE' : 'PAID';
        const deliveryTemplateName = `COPY_RESUME_${getDeliveryType(order.orderDelivery.deliveryType)}_${order.deliveryMethod.code}_${aliasFree}`;
        return deliveryTemplateName;
    }

    /**
     * @param Order order
     * Obtener plantilla dependiendo de la orden
     */
    getExportOfficeReport(order: Order) {
        const deliveryTemplateName = `EXPORT_OFFICE_${order.deliveryMethod.code}`;
        return deliveryTemplateName;
    }

    async findByIds(orderIds: any) {
        return await this.orderRepository.createQueryBuilder('o')
            .leftJoinAndSelect('o.orderDelivery', 'od')
            .where('o.id IN (:orderIds)', {orderIds: orderIds})
            .getMany();
    }

    async findByIdsWithDeliveries(orderIds: any) {
        return await this.orderRepository.createQueryBuilder('o')
            .where('o.id IN (:orderIds)', {orderIds: orderIds})
            .leftJoinAndSelect('o.orderDelivery', 'od')
            .getMany();
    }

    async findByIdsWithFullRelations(orderIds: any) {
        return await this.orderRepository.createQueryBuilder('o')
            .where('o.id IN (:orderIds)', {orderIds: orderIds})
            .leftJoinAndSelect('o.orderDelivery', 'od')
            .leftJoinAndSelect('o.customer', 'cu')
            .leftJoinAndSelect('o.deliveryMethod', 'dm')
            .getMany();
    }

    /** Update orders */
    async updateOffices(office: Office, condition){
        return await this.orderRepository.createQueryBuilder('o')
            .update(Order)
            .set({ office: office })
            .where(condition)
            .execute();
    }

    /** Remove office */
    async removeOffice(orderId){
        return await this.orderRepository.createQueryBuilder('o')
            .update(Order)
            .set({ office: null })
            .where({id: orderId})
            .execute();
    }

    /** Reporte basado en envio de Ordenes */
    async findByDelivery(dateFrom, dateTo, deliveryMethod, status){

        return await this.orderRepository.createQueryBuilder('o')
            .leftJoinAndSelect('o.customer', 'c')
            .leftJoinAndSelect('c.municipality', 'm')
            .leftJoinAndSelect('c.state', 's')
            .leftJoinAndSelect('o.orderDelivery', 'd')
            .leftJoinAndSelect('o.deliveryMethod', 'i')
            .andWhere("d.deliveryDate", Between(dateFrom, dateTo))
            .andWhere("o.deliveryMethod = :deliveryMethod", {deliveryMethod: 1})
            .andWhere("o.status", status)
            .getMany();
    }

    /** Reporte Conciliados */
    async findOrderConciliates(dateFrom, dateTo, deliveryMethod){

        return await this.orderRepository.createQueryBuilder('o')
            .leftJoinAndSelect('o.customer', 'c')
            .leftJoinAndSelect('o.orderDelivery', 'd')
            .leftJoinAndSelect('o.deliveryMethod', 'i')
            .where("o.orderDelivery", Not(IsNull()))
            .andWhere("d.chargeOnDelivery = :chargeOnDelivery", { chargeOnDelivery : true })
            .andWhere("o.dateOfSale", Between(dateFrom, dateTo))
            .andWhere("o.deliveryMethod", deliveryMethod)
            .getMany();
    }


    /** find order pending for update delivery status */
    /** Return Order */
    async findPendingForDelivery() : Promise<Order[]>{

        return await this.orderRepository.createQueryBuilder('o')
            .leftJoinAndSelect('o.orderDelivery', 'd')
            .leftJoinAndSelect('o.deliveryMethod', 'i')
            .where("o.orderDelivery", Not(IsNull()))
            .andWhere("d.sync = :sync", {sync: true})
            .andWhere("d.tracking", Not(IsNull()))
            .getMany();
    }

    /** Reporte Ventas */

    async getStatsSalesDateRange(dateFrom, DateTo, user){
    }


    /** Obtener estadisticas de Ventas por Dia/Mes/Semana */
    async getStatsDay(dateFrom, dateTo, group, user){

        const orderRepository = this.orderRepository.createQueryBuilder('o');

        switch(group) {
            case 'dia':
                orderRepository.select('SUM(o.totalAmount) as monto, SUM(o.totalRevenue) as ganancia, SUM(o.quantity) as piezas, concat_ws("-",day(o.dateOfSale),month(o.dateOfSale),year(o.dateOfSale)) as fecha');
                orderRepository.addGroupBy("year(o.dateOfSale)")
                orderRepository.addGroupBy("month(o.dateOfSale)")
                orderRepository.addGroupBy("day(o.dateOfSale)");
                break;
            case 'semana':
                orderRepository.select('SUM(o.totalAmount) as monto, SUM(o.totalRevenue) as ganancia, SUM(o.quantity) as piezas, concat_ws("-",week(o.dateOfSale,1),year(o.dateOfSale)) as fecha');
                orderRepository.addGroupBy("year(o.dateOfSale)")
                orderRepository.addGroupBy("week(o.dateOfSale,1)");
                break;
            case 'mes':
                orderRepository.select('SUM(o.totalAmount) as monto, SUM(o.totalRevenue) as ganancia, SUM(o.quantity) as piezas, concat_ws("-",month(o.dateOfSale,1),year(o.dateOfSale)) as fecha');
                orderRepository.addGroupBy("year(o.dateOfSale)")
                orderRepository.addGroupBy("month(o.dateOfSale)");
                break;
            case 'ano':
                orderRepository.select('SUM(o.totalAmount) as monto, SUM(o.totalRevenue) as ganancia, SUM(o.quantity) as piezas, year(o.dateOfSale) as fecha');
                orderRepository.addGroupBy("year(o.dateOfSale)");
                break;
        }

        if(user !== null){
            orderRepository.where("o.user", user);
        }

        orderRepository.andWhere("DATE(o.dateOfSale) >= :before");
        orderRepository.andWhere("DATE(o.dateOfSale) <= :after");

        orderRepository.setParameters({before: dateFrom, after: dateTo});

        const rows = await orderRepository.getRawMany();

        let results = [];

        rows.map(item => {
           results.push({
               fecha: item["fecha"],
               monto: parseFloat(item["monto"]),
               ganancia: parseFloat(item["ganancia"]),
               piezas: parseFloat(item["piezas"])
           });
        });

        return results;
    }

    /** Obtener estadisticas de Ventas por Estados */

    async getStatsOrigen(dateFrom, dateTo, group){

        const orderRepository = this.orderRepository.createQueryBuilder('o');
        const options = await this.fieldOptionService.findByGroup('ORDERS_ORIGIN');

        orderRepository.addSelect("o.totalAmount");
        orderRepository.addSelect("SUM(IF(LOWER(o.origen) LIKE 'whatsapp%', o.totalAmount,0))", "Whatsapp");
        options.map(item => {
            if(!(item.value.toLowerCase().includes("whatsapp"))) {
                orderRepository.addSelect("SUM(IF(o.origen='" + item.value + "', o.totalAmount,0))", string_to_slug(item.value));
            }
        });

        switch(group) {
            case 'dia':
                orderRepository.addSelect("CONCAT_WS('-',day(o.dateOfSale),month(o.dateOfSale),year(o.dateOfSale))", 'fecha');
                orderRepository.addGroupBy("YEAR(o.dateOfSale)")
                orderRepository.addGroupBy("MONTH(o.dateOfSale)")
                orderRepository.addGroupBy("DAY(o.dateOfSale)");
                break;
            case 'semana':
                orderRepository.addSelect("WEEK(o.dateOfSale,1) as semana, year(o.dateOfSale) as ano, CONCAT_WS('-',week(o.dateOfSale,1),year(o.dateOfSale))", 'fecha');
                orderRepository.addGroupBy("YEAR(o.dateOfSale)")
                orderRepository.addGroupBy("WEEK(o.dateOfSale,1)");
                orderRepository.addOrderBy("ano");
                orderRepository.addOrderBy("semana");
                break;
            case 'mes':
                orderRepository.addSelect("CONCAT_WS('-',month(o.dateOfSale),year(o.dateOfSale))", 'fecha');
                orderRepository.addGroupBy("YEAR(o.dateOfSale)")
                orderRepository.addGroupBy("MONTH(o.dateOfSale)");
                orderRepository.addOrderBy("YEAR(o.dateOfSale)");
                orderRepository.addOrderBy("MONTH(o.dateOfSale)");
                break;
            case 'ano':
                orderRepository.addSelect("YEAR(o.dateOfSale)", 'fecha');
                orderRepository.groupBy("YEAR(o.dateOfSale)")
                orderRepository.orderBy("YEAR(o.dateOfSale)");
                break;
        }

        orderRepository.andWhere("DATE(o.dateOfSale) >= :before");
        orderRepository.andWhere("DATE(o.dateOfSale) <= :after");

        orderRepository.setParameters({before: dateFrom, after: dateTo});

        orderRepository.getQuery();

        const rows = await orderRepository.getRawMany();



        let results = [];

        rows.map(item => {

            let modified = {};
            options.map(origenItem => {
                if(!(origenItem.name.toLowerCase().includes("whatsapp"))) {
                    modified[origenItem.name] = parseFloat(item[string_to_slug(origenItem.value)]);
                }
            });

            modified["Whatsapp"] = parseFloat(item["Whatsapp"]);

            results.push({
                fecha: item['fecha'],
                ...modified
            })

        });

        return results;

    }

    /** Obtener estadisticas de Ventas por Estados */

    async getStatsTipo(dateFrom, dateTo, group){

        const orderRepository = this.orderRepository.createQueryBuilder('o');

        orderRepository.addSelect("o.totalAmount");
        orderRepository.addSelect("SUM(IF(d.deliveryType=1, 1,0))", "cantidadPrevioPago");
        orderRepository.addSelect("SUM(IF(d.deliveryType=1, o.totalAmount,0))", "montoPrevioPago");
        orderRepository.addSelect("SUM(IF(d.deliveryType=3, 1,0))", "cantidadContraEntrega");
        orderRepository.addSelect("SUM(IF(d.deliveryType=3, o.totalAmount,0))", "montoContraEntrega");
        orderRepository.leftJoin("o.orderDelivery", "d")


        switch(group) {
            case 'dia':
                orderRepository.addSelect("CONCAT_WS('-',day(o.dateOfSale),month(o.dateOfSale),year(o.dateOfSale))", 'fecha');
                orderRepository.addGroupBy("YEAR(o.dateOfSale)")
                orderRepository.addGroupBy("MONTH(o.dateOfSale)")
                orderRepository.addGroupBy("DAY(o.dateOfSale)");
                orderRepository.addOrderBy("year(o.dateOfSale)");
                orderRepository.addOrderBy("month(o.dateOfSale)");
                orderRepository.addOrderBy("day(o.dateOfSale)");
                break;
            case 'semana':
                orderRepository.addSelect("WEEK(o.dateOfSale,1) as semana, year(o.dateOfSale) as ano, CONCAT_WS('-',week(o.dateOfSale,1),year(o.dateOfSale))", 'fecha');
                orderRepository.addGroupBy("YEAR(o.dateOfSale)")
                orderRepository.addGroupBy("WEEK(o.dateOfSale,1)");
                orderRepository.addOrderBy("ano");
                orderRepository.addOrderBy("semana");
                break;
            case 'mes':
                orderRepository.addSelect("CONCAT_WS('-',month(o.dateOfSale),year(o.dateOfSale))", 'fecha');
                orderRepository.addGroupBy("YEAR(o.dateOfSale)")
                orderRepository.addGroupBy("MONTH(o.dateOfSale)");
                orderRepository.addOrderBy("YEAR(o.dateOfSale)");
                orderRepository.addOrderBy("MONTH(o.dateOfSale)");
                break;
            case 'ano':
                orderRepository.addSelect("YEAR(o.dateOfSale)", 'fecha');
                orderRepository.groupBy("YEAR(o.dateOfSale)")
                orderRepository.orderBy("YEAR(o.dateOfSale)");
                break;
        }

        orderRepository.andWhere("DATE(o.dateOfSale) >= :before");
        orderRepository.andWhere("DATE(o.dateOfSale) <= :after");

        orderRepository.setParameters({before: dateFrom + " 00:00:00", after: dateTo + " 23:59:59"});

        const rows = await orderRepository.getRawMany();

        let results = [];

        rows.map(item => {
            results.push({
                fecha: item['fecha'],
                cantidadPrevioPago: item['cantidadPrevioPago'],
                montoPrevioPago: item['montoPrevioPago'],
                cantidadContraEntrega: item['cantidadContraEntrega'],
                montoContraEntrega: item['montoContraEntrega']
            });
        });

        return results;

    }

    async getStatsMasVendidos(dateFrom, dateTo) {
        const orderRepository = this.orderDetailRepository.createQueryBuilder('od');

        orderRepository.addSelect("p.reference", "id");
        orderRepository.addSelect("od.quantity", "cantidad");
        orderRepository.addSelect("pa.available", "existencia");

        orderRepository.leftJoin("od.product", "p");
        orderRepository.leftJoin("p.productAvailable", "pa");
        orderRepository.leftJoin("od.order", "o");

        orderRepository.andWhere("DATE(o.dateOfSale) >= :before");
        orderRepository.andWhere("DATE(o.dateOfSale) <= :after");

        orderRepository.setParameters({before: dateFrom, after: dateTo});

        orderRepository.groupBy("p.id")
        orderRepository.orderBy("cantidad", "DESC");
        orderRepository.limit(20);

        const rows = await orderRepository.getRawMany();

        return rows;

    }

    async getStatsHoras(dateFrom, dateTo) {

        const orderRepository = this.orderRepository.createQueryBuilder('o');

        orderRepository.addSelect("hour(o.createdAt)", "hora");
        orderRepository.addSelect("COUNT(*)", "cantidad");
        orderRepository.addSelect("SUM(o.totalAmount)", "monto");

        orderRepository.where("DATE(o.dateOfSale) >= :before");
        orderRepository.andWhere("DATE(o.dateOfSale) <= :after");

        orderRepository.setParameters({before: dateFrom + " 00:00:00", after: dateTo + " 23:59:59"});

        orderRepository.groupBy("hora");

        const rows = await orderRepository.getRawMany();

        let results = [];

        for(let i=0; i<=23; i++){
            results.push({
                hora: i,
                monto: 0,
                cantidad: 0
            });
        }

        rows.map(item => {
            results[item["hora"]]['monto'] = item["monto"];
            results[item["hora"]]['cantidad'] = item["cantidad"];
        });

        return results;

    }

    async getStatsReincidencias(dateFrom, dateTo) {

        const orderRepository = this.orderRepository.createQueryBuilder('o');

        orderRepository.addSelect("COUNT(c.id)", "cantidad");


        orderRepository.where("DATE(o.dateOfSale) >= :before");
        orderRepository.andWhere("DATE(o.dateOfSale) <= :after");
        orderRepository.andWhere("o.status != :status");

        orderRepository.leftJoin("o.customer", "c");

        orderRepository.setParameters({before: dateFrom + " 00:00:00", after: dateTo + " 23:59:59", status: OrderStatus.CANCELED});

        orderRepository.groupBy("c.id");

        const rows = await orderRepository.getRawMany();

        let clientes = 0;
        let reincidentes = 0;

        rows.map(item => {
            clientes++;
            if(parseInt(item['cantidad']) > 1){
                reincidentes += parseInt(item['cantidad']);
            }
        });

        return {
            clientes,
            reincidentes
        };

    }

    async getStatsWhatsapp(dateFrom, dateTo) {
        const orderRepository = this.orderRepository.createQueryBuilder('o');
        orderRepository.addSelect("o.origen");
        orderRepository.addSelect("SUM(o.totalAmount) as monto");
        orderRepository.where("o.origen LIKE :origen");
        orderRepository.andWhere("DATE(o.dateOfSale) >= :before");
        orderRepository.andWhere("DATE(o.dateOfSale) <= :after");

        orderRepository.setParameters({origen: "%WHATSAPP%", before: dateFrom, after: dateTo});
        orderRepository.groupBy("o.origen");
        //TODO -- Agregar aqui esto $this->db->order_by('numeros(venta.origen)');

        const rows = await orderRepository.getRawMany();

        let results = [];

        rows.map(item => {
            results.push({
                origen: item["origen"],
                monto: parseFloat(item["monto"])
            });
        });

        return results;

    }

    /** Obtener estadisticas de Ventas por Estados */

    async getStatsStates(dateFrom, dateTo){

            const orderRepository = this.orderRepository.createQueryBuilder('o');

            orderRepository.leftJoin('o.customer', 'c');
            orderRepository.leftJoin('c.state', 's');
            orderRepository.select('SUM(o.totalAmount) as monto')
            orderRepository.addSelect('s.name', 'estado')

            orderRepository.andWhere("DATE(o.dateOfSale) >= :before");
            orderRepository.andWhere("DATE(o.dateOfSale) <= :after");

            orderRepository.groupBy("c.state");

            orderRepository.setParameters({before: dateFrom + ' 00:00:00', after: dateTo + ' 23:59:59'});

            const rows = await orderRepository.getRawMany();

            let results = [];

            rows.map(item => {
                results.push({
                    estado: item["estado"],
                    monto: parseFloat(item["monto"])
                });
            });

            return results;

    }

}
