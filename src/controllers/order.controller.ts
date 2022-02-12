import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {Order} from "../models/Order";
import {OrderService} from "../services/order.service";
import {GET, POST, PUT, route} from "awilix-express";
import {OrderCreateDTO, OrderListDTO, OrderShortDTO, OrderShowDTO, OrderUpdateDTO} from "./parsers/order";
import {Request, Response} from "express";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {DeliveryMethod} from "../models/DeliveryMethod";
import {DeliveryMethodService} from "../services/deliveryMethod.service";
import {UserService} from "../services/user.service";
import {OrderDetail} from "../models/OrderDetail";
import {isCash, isChargeOnDelivery, isPaymentMode} from "../common/enum/paymentModes";
import {OrderProduct} from "./parsers/orderProduct";
import {CustomerService} from "../services/customer.service";
import {TemplateService} from "../services/template.service";
import {currencyFormat, getDeliveryShortType, QrBarImage} from "../common/helper/helpers";
import {ConditionalQuery} from "../common/controllers/conditional.query";
import {PageQuery} from "../common/controllers/page.query";
import {OperationQuery} from "../common/controllers/operation.query";
import {OrderStatus} from "../common/enum/orderStatus";
import {BatchRequestService} from "../services/batchRequest.service";
import {BatchRequestTypes, BatchRequestTypesStatus} from "../common/enum/batchRequestTypes";
import {UserShortDTO} from "./parsers/user";
import {MEDIA_FORMAT_OUTPUT, MediaManagementService} from "../services/mediaManagement.service";
import {ExpotersPostventa} from "../templates/exporters/expoters-postventa";
import {ExportersConciliates} from "../templates/exporters/exporters-conciliates";
import {CommentService} from "../services/comment.service";
import {OrderHistoricService} from "../services/orderHistoric.service";
import {OrderHistoricDTO, OrderHistoricListDTO} from "./parsers/orderHistoric";
import {EventStatus} from "../common/enum/eventStatus";
import {OrderConditional} from "../common/enum/order.conditional";
import {TemplatesRegisters} from "../common/enum/templatesTypes";


@route('/order')
export class OrderController extends BaseController<Order> {
    constructor(
        private readonly orderService: OrderService,
        private readonly deliveryMethodService: DeliveryMethodService,
        private readonly userService: UserService,
        private readonly customerService: CustomerService,
        private readonly templateService: TemplateService,
        private readonly batchRequestService: BatchRequestService,
        private readonly mediaManagementService: MediaManagementService,
        private readonly commentService: CommentService,
        private readonly orderHistoricService: OrderHistoricService,
    ){
        super(orderService);
    };

    protected customDefaultOrder(page: PageQuery) {
        page.addOrder('modifiedDate', OrderConditional.DESC);
        page.addOrder('id', OrderConditional.ASC);
    }

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
            const userIdFromSession = req['user'].id;
            const user = await this.userService.find(userIdFromSession);

            if(!user){
                throw new InvalidArgumentException("Usuario para generar orden es requerido");
            }

            const order: Order = await this.orderService.addOrUpdateOrder(parse, deliveryMethod, user, null, false);
            const orderDetails: OrderDetail[] = await this.orderService.getDetails(order);
            order.orderDetails = orderDetails;

            //save historic (if change status)
            await this.orderHistoricService.registerEvent(order, user);

            return res.json({status: 200 , order: OrderShowDTO(order)});
        }catch(e){
            this.handleException(e, res);
        }
    }

    @route('/canceledStatus')
    @POST()
    public async canceledStatus(req: Request, res: Response) {
        try {
            const request = req.body;

            if(!request.batch && !request.order){
                throw new InvalidArgumentException("No existe registro indicado para actualizar");
            }

            /** LLevar a un servicio que administre los estados */
            /** Entregar al servicio (sesión, orden) */

            let entity;
            let orders = [];

            if(request.order) {
                entity = await this.orderService.find(parseInt(request.order));
                orders.push(entity);
            } else {
                entity = await this.batchRequestService.find(parseInt(request.batch));
                if(!entity || entity.status != BatchRequestTypesStatus.COMPLETED){
                    throw new InvalidArgumentException("Lote no ha sido encontrado");
                }
                orders = entity.body.map(item => item.order);
                orders = await this.orderService.findByIds(orders);
            }

            if(request.batch) {
                let updates = [];
                await Promise.all(orders.map(async entity => {
                    if (entity.status === OrderStatus.PENDING) {
                        entity.status = OrderStatus.CANCELED;
                        updates.push(await this.orderService.createOrUpdate(entity));

                        const orderDetails: OrderDetail[] = await this.orderService.getDetails(entity);
                        //save historic
                        const userIdFromSession = req['user'].id;
                        const user = await this.userService.find(userIdFromSession);

                        await this.orderService.updateInventaryForOrderDetail(orderDetails, true);
                        await this.orderHistoricService.registerEvent(entity, user);
                    }
                }));
                entity.status = BatchRequestTypesStatus.EXECUTED;
                await this.batchRequestService.createOrUpdate(entity);
                return res.json({status: 200, updates: updates.map(item => OrderShortDTO(item))});
            } else {
                if (OrderStatus.PENDING === 1) {
                    //PENDIENTE -> CONFIRMADO
                    entity.status = OrderStatus.CANCELED;

                    const saved: Order = await this.orderService.createOrUpdate(entity);
                    const order: Order = await this.orderService.find(saved.id, this.getDefaultRelations(true));
                    const orderDetails: OrderDetail[] = await this.orderService.getDetails(order);
                    order.orderDetails = orderDetails;
                    //save historic
                    const userIdFromSession = req['user'].id;
                    const user = await this.userService.find(userIdFromSession);

                    await this.orderService.updateInventaryForOrderDetail(orderDetails, true);
                    await this.orderHistoricService.registerEvent(order, user);

                    return res.json({status: 200, order: OrderShowDTO(order)});
                } else {
                    throw new InvalidArgumentException("No existe registro indicado para actualizar");
                }
            }

        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    @route('/nextStatus')
    @POST()
    public async nextStatus(req: Request, res: Response) {
        try {
            const request = req.body;

            if(!request.batch && !request.order){
                throw new InvalidArgumentException("No existe registro indicado para actualizar");
            }

            /** LLevar a un servicio que administre los estados */
            /** Entregar al servicio (sesión, orden) */

            let entity;
            let orders = [];

            if(request.order) {
                entity = await this.orderService.find(parseInt(request.order), ['orderDelivery']);
                orders.push(entity);
            } else {
                entity = await this.batchRequestService.find(parseInt(request.batch));
                if(!entity || entity.status != BatchRequestTypesStatus.COMPLETED){
                    throw new InvalidArgumentException("Lote no ha sido encontrado");
                }
                orders = entity.body.map(item => item.order);
                orders = await this.orderService.findByIds(orders);
            }

            if(request.batch) {
                let updates = [];
                await Promise.all(orders.map(async entity => {

                    let changeStatus = false;
                    if (entity.status === 1) {
                        //PENDIENTE -> CONFIRMADO
                        entity.status = 2;
                        entity.dateOfSale = new Date();
                        changeStatus = true;
                    } else if (entity.status === 2) {
                        //CONFIRMADO -> IMPRESO
                        entity.status = 3;
                        changeStatus = true;
                    } else if(entity.status === 3) {
                        //IMPRESO -> ENVIADO
                        entity.status = 4;
                        changeStatus = true;
                    } else if(entity.status === 5 && entity.orderDelivery.deliveryType === 1) {
                        //CONCILIADO (PREVIOPAGO) -> ENVIADO
                        entity.status = 3;
                        changeStatus = true;
                    }
                    if(changeStatus) {
                        updates.push(await this.orderService.createOrUpdate(entity));
                    }

                }));
                entity.status = BatchRequestTypesStatus.EXECUTED;
                await this.batchRequestService.createOrUpdate(entity);
                return res.json({status: 200, updates: updates.map(item => OrderShortDTO(item))});
            } else {
                entity = orders[0];
                let changeStatus = false;
                if (entity.status === 1) {
                    //PENDIENTE -> CONFIRMADO
                    entity.dateOfSale = new Date();
                    entity.status = 2;
                    changeStatus = true;
                } else if (entity.status === 2) {
                    //CONFIRMADO -> IMPRESO
                    entity.status = 3;
                    changeStatus = true;
                } else if(entity.status === 3) {
                    //IMPRESO -> ENVIADO
                    entity.status = 4;
                    changeStatus = true;
                } else if(entity.status === 5 && entity.orderDelivery.deliveryType === 1) {
                    //CONCILIADO (PREVIOPAGO) -> ENVIADO
                    entity.status = 3;
                    changeStatus = true;
                }

                const saved: Order = await this.orderService.createOrUpdate(entity);
                const order: Order = await this.orderService.find(saved.id, this.getDefaultRelations(true));
                const orderDetails: OrderDetail[] = await this.orderService.getDetails(order);
                order.orderDetails = orderDetails;

                //save historic (if change status)
                if(changeStatus) {
                    const userIdFromSession = req['user'].id;
                    const user = await this.userService.find(userIdFromSession);
                    await this.orderHistoricService.registerEvent(order, user);
                }

                return res.json({status: 200, order: OrderShowDTO(order)});
            }

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
            /** TODO -- agregar refreshAddress -> si recibo esto refrescar la dirección */
            //['orderDetails', 'customer', 'deliveryMethod', 'user', 'customer.municipality', 'customer.state', 'orderDelivery']
            const oldEntity = await this.orderService.find(parseInt(req.params.id), ['orderDetails','orderDelivery', 'deliveryMethod', 'customer', 'user']);
            if(oldEntity) {
                let orderDetails = await this.orderService.getDetails(oldEntity);
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

                    orderDetails = await this.orderService.updateOrder(parseOrderDetail, oldEntity.orderDetails, oldEntity);
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

                const order: Order = await this.orderService.addOrUpdateOrder(parse, deliveryMethod, null, oldEntity, parse.refreshAddress);
                order.orderDetails = orderDetails;

                /** TODO -- Asociar usuario a la orden */
                const userIdFromSession = req['user'].id;
                const user = await this.userService.find(userIdFromSession);
                await this.orderHistoricService.registerEvent(order, user, EventStatus.UPDATED);

                return res.json({status: 200, order: OrderShowDTO(order)});
            }
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    /**
     * Obtener plantilla de impresión
     * @param req
     * @param res
     */
    @route('/:id/print')
    @GET()
    public async print(req: Request, res: Response) {
        try {
            let order = await this.orderService.find(parseInt(req.params.id), ['orderDelivery', 'customer','customer.state','customer.municipality', 'user', 'deliveryMethod', 'orderDetails', 'orderDetails.product']);
            if (order) {
                const qrBar = await QrBarImage(order.id);
                const deliveryShortType = getDeliveryShortType(order.orderDelivery.deliveryType);

                let comments = await this.commentService.getByOrder(order);

                const object = {
                    order,
                    qrBar,
                    orderDetails: order.orderDetails,
                    hasPayment: isPaymentMode(order.paymentMode),
                    isCash: isCash(order.paymentMode),
                    isChargeOnDelivery: isChargeOnDelivery(order.orderDelivery),
                    hasPiecesForChanges: (order.piecesForChanges && order.piecesForChanges > 0),
                    deliveryShortType: deliveryShortType,
                    hasComments: comments.length > 0,
                    comments: comments
                };
                const template = await this.templateService.getTemplate(TemplatesRegisters.PRINT_ORDER, object);
                if(!template){
                    throw new InvalidArgumentException("No se ha podido generar el reporte");
                }
                return res.json({status: 200, html: template});
            }
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    /**
     * Obtener Historial de Orden
     * @param req
     * @param res
     */
    @route('/:id/historic')
    @GET()
    public async historic(req: Request, res: Response) {
        try {
            const order = await this.orderService.find(parseInt(req.params.id));
            const historic = await this.orderHistoricService.findByObject({"order": order}, ["user"]);

            if (order) {
                return res.json({status: 200, orderHistoric: OrderHistoricListDTO(historic)});
            }

        } catch (e) {
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    /** Generar las facturas de ordenes */
    @route('/ConfirmConciliation')
    @POST()
    public async closeOrder(req: Request, res: Response) {
        const body = req.body;
        const ids : any = body;
        try {
            if (ids.length === 0) {
                throw new InvalidArgumentException("Debe ingresar registros a conciliar");
            }

            const orders = await this.orderService.findByIds(ids);

            let itemSuccess = [];
            let itemFailures = [];

            await Promise.all(orders.map(async order => {
                order.status = OrderStatus.RECONCILED;
                try {
                    await this.orderService.update(order);
                    await this.orderHistoricService.registerEvent(order, null);
                    itemSuccess.push(order.id);
                }catch(e){
                    itemFailures.push(order.id);
                }
            }));

            return res.json({status: 200, itemSuccess, itemFailures});

        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    /** Download Report - Post Venta */
    @route('/gen/postSaleReport')
    @GET()
    protected async postSaleReport(req: Request, res: Response){
        try {
            const {dateFrom, dateTo, deliveryMethod, status} = req.query;

            const orders: Order[] = await this.orderService.findByDelivery(dateFrom, dateTo, deliveryMethod, status);

            const exportable = new ExpotersPostventa();

            const base64File = await this.mediaManagementService.createExcel(exportable, orders, res, MEDIA_FORMAT_OUTPUT.b64);
            return res.json({status: 200, data: base64File, name: exportable.getFileName() } );
        }catch(e){
            console.log("error -- ", e.message);
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Orden no ha sido encontrada"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    /** Download - Conciliation Report */
    @route('/gen/conciliationReport')
    @GET()
    protected async ConciliationReport(req: Request, res: Response){
        try {
            const {dateFrom, dateTo, deliveryMethod} = req.query;

            const orders: Order[] = await this.orderService.findOrderConciliates(dateFrom, dateTo, deliveryMethod);

            const exportable = new ExportersConciliates();

            const base64File = await this.mediaManagementService.createExcel(exportable, orders, res, MEDIA_FORMAT_OUTPUT.b64);
            return res.json({status: 200, data: base64File, name: exportable.getFileName() } );
        }catch(e){
            console.log("error -- ", e.message);
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("No ha sido encontrado el reporte"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    /**
     * Obtener plantilla de impresión
     * @param req
     * @param res
     */
        @route('/batch/printRequest')
    @GET()
    public async printRequest(req: Request, res: Response) {
        try {
            const limitForQueries = 5000; //Limite para una petición

            const query = req.query;
            const conditional = query.conditional ? query.conditional + "" : null;

            const queryCondition = ConditionalQuery.ConvertIntoConditionalParams(conditional);
            const operationQuery = new OperationQuery(null, null);
            let page = new PageQuery(limitForQueries,0,queryCondition, operationQuery);

            const countRegisters = await this.orderService.count(page);

            page.setRelations(['orderDelivery', 'customer','customer.state','customer.municipality', 'user', 'deliveryMethod', 'orderDetails', 'orderDetails.product']);

            let orders: Array<Order> = await this.orderService.all(page);

            let isImpress = true;

            if(orders.length > 0){
                let orderId = 0;
                orders.forEach(item  => {
                    //Regla para poder ser impresa
                    if(item.status <= OrderStatus.PENDING){
                        isImpress = false;
                        orderId = item.id;
                    }
                });

                if(!isImpress){
                    throw new InvalidArgumentException("Orden : "+orderId+" No puede ser impresa");
                }

                let batchHtml : any = [];
                const qrBar : any = [];

                const result = orders.map(async order => {

                    qrBar[order.id] = await QrBarImage(order.id);
                    const deliveryShortType = getDeliveryShortType(order.orderDelivery.deliveryType);

                    let comments = await this.commentService.getByOrder(order);

                    const object = {
                        order,
                        qrBar,
                        orderDetails: order.orderDetails,
                        hasPayment: isPaymentMode(order.paymentMode),
                        isChargeOnDelivery: isChargeOnDelivery(order.orderDelivery),
                        isCash: isCash(order.paymentMode),
                        hasPiecesForChanges: (order.piecesForChanges && order.piecesForChanges > 0),
                        deliveryShortType: deliveryShortType,
                        hasComments: comments.length > 0,
                        comments: comments
                    };

                    const template = await this.templateService.getTemplate(TemplatesRegisters.PRINT_ORDER, object);
                    if(!template){
                        throw new InvalidArgumentException("No se ha encontrado un resumen para esta orden");
                    }

                    return batchHtml.push({order: order.id, html: template});
                });

                await Promise.all(result);

                const user = await this.userService.find(req["user"]);

                const save = await this.batchRequestService.createOrUpdate({
                    body: batchHtml,
                    type: BatchRequestTypes.IMPRESSION,
                    status: BatchRequestTypesStatus.COMPLETED,
                    user: UserShortDTO(user)
                });

                return res.json({status: 200, batch: {...save}});

            } else {
                return res.json({status: 400, error: "No se han encontrado registros"});
            }
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    /**
     * Obtener resumen de una orden
     * @param req
     * @param res
     */
    @route('/:id/boardResume')
    @GET()
    public async getResume(req: Request, res: Response) {
        try {
            const order = await this.orderService.find(parseInt(req.params.id), ['orderDelivery', 'customer', 'user', 'deliveryMethod']);
            if (order) {
                const templateName = this.orderService.getBoardRuleTemplate(order);
                const template = await this.templateService.getTemplate(templateName, {order});
                if(!template){
                    console.error("-- template name not found", templateName);
                    throw new InvalidArgumentException("No se ha encontrado un resumen para esta orden");
                }
                return res.json({status: 200, text: template});
            }
            throw new InvalidArgumentException("No podemos procesar esta solicitud.");
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    protected getDefaultRelations(isDetail): Array<string> {
        if(isDetail) {
            return ['customer', 'deliveryMethod', 'user', 'customer.municipality', 'customer.state', 'orderDelivery', 'orderDelivery.deliveryLocality'];
        } else {
            return ['payment', 'customer', 'deliveryMethod', 'orderDetails', 'user', 'customer.municipality', 'customer.state', 'orderDelivery'];
        }
    }

    getGroupRelations(): Array<string> {
        return ['user'];
    }



    // Reportes
    /**
     * Obtener resumen de una orden
     * @param req
     * @param res
     */
    @route('/:id/boardResume')
    @GET()
    public async getDailySaleStats(req: Request, res: Response) {
        try{
            const {dateFrom, dateTo, user} = req.query;
        }catch(e){

        }
    }

}
