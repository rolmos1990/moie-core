import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {Order} from "../models/Order";
import {OrderService} from "../services/order.service";
import {GET, POST, PUT, route} from "awilix-express";
import {
    Order as OrderCreate,
    OrderCreateDTO,
    OrderListDTO,
    OrderListShortDTO,
    OrderShortDTO,
    OrderShowDTO,
    OrderUpdate,
    OrderUpdateDTO
} from "./parsers/order";
import {Request, Response} from "express";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {DeliveryMethodService} from "../services/deliveryMethod.service";
import {UserService} from "../services/user.service";
import {OrderDetail} from "../models/OrderDetail";
import {isCash, isChargeOnDelivery, isPaymentMode} from "../common/enum/paymentModes";
import {OrderProduct} from "./parsers/orderProduct";
import {CustomerService} from "../services/customer.service";
import {TemplateService} from "../services/template.service";
import {getDeliveryShortType, QrBarImage} from "../common/helper/helpers";
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
import {OrderHistoricListDTO} from "./parsers/orderHistoric";
import {EventStatus} from "../common/enum/eventStatus";
import {OrderConditional} from "../common/enum/order.conditional";
import {TemplatesRegisters} from "../common/enum/templatesTypes";
import {OrderDeliveryService} from "../services/orderDelivery.service";
import {DeliveryTypes} from "../common/enum/deliveryTypes";
import {converterArrayToProductsObject} from "../common/helper/converters";
import {Operator} from "../common/enum/operators";
import {Comment} from "../models/Comment";
import {OrderTypes} from "../common/enum/orderTypes";


@route('/order')
export class OrderController extends BaseController<Order> {
    constructor(
        protected readonly orderService: OrderService,
        protected readonly userService: UserService,
        private readonly deliveryMethodService: DeliveryMethodService,
        private readonly customerService: CustomerService,
        private readonly templateService: TemplateService,
        private readonly batchRequestService: BatchRequestService,
        private readonly mediaManagementService: MediaManagementService,
        private readonly commentService: CommentService,
        private readonly orderHistoricService: OrderHistoricService,
        private readonly orderDeliveryService: OrderDeliveryService
    ){
        super(orderService, userService);
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
            //return OrderListShortDTO(entity);
        }
    }

    getParsePOST(entity: Object): Object {
        return entity;
    }

    getParsePUT(entity: Order): Object {
        return entity;
    }

    @POST()
    public async create(req: Request, res: Response) {
        try {
                const user = await this.getUser(req);
                const _order = this.orderService.newOrder();
                const parse : OrderCreate = await OrderCreateDTO(req.body);

                if(parse.paymentMode) {
                    /** Actualización de modos de pagos */
                    if (!parse.hasPaymentMode()) {
                        throw new InvalidArgumentException("El modo de pago es invalido");
                    }
                }

                let order = await this.orderService.registerOrder(_order, parse, user);
                const orderDetail : OrderProduct[] = converterArrayToProductsObject(req.body.products);
                order = await this.orderService.updateOrderDetail(order, orderDetail, user);
                await this.orderService.addMayorist(_order, true);

                return res.json({status: 200, order: OrderShowDTO(order)});
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
                entity = await this.orderService.findFull(request.order);
                orders.push(entity);
            } else {
                entity = await this.batchRequestService.find(parseInt(request.batch));
                if(!entity || entity.status != BatchRequestTypesStatus.COMPLETED){
                    throw new InvalidArgumentException("Lote no ha sido encontrado");
                }
                orders = entity.body.map(item => item.order);
                orders = await this.orderService.findByIds(orders);
            }

            //save historic
            const user = await this.getUser(req);

            if(request.batch) {
                let updates = [];
                await Promise.all(orders.map(async _item => {
                    const _order : Order = _item;
                    if (_order.canBeCanceled()) {
                        await this.orderService.cancelOrder(_order, user);
                        updates.push(_order);
                    }
                }));
                entity.status = BatchRequestTypesStatus.EXECUTED;
                await this.batchRequestService.createOrUpdate(entity);
                return res.json({status: 200, updates: updates.map(item => OrderShortDTO(item))});
            } else {
                if (entity.canBeCanceled()) {
                    await this.orderService.cancelOrder(entity, user);
                    return res.json({status: 200, order: OrderShowDTO(entity)});
                } else {
                    throw new InvalidArgumentException("El pedido no puede ser anulado bajo es estado actual");
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
                entity = await this.orderService.find(parseInt(request.order), ['orderDelivery', 'deliveryMethod', 'customer']);
                orders.push(entity);
            } else {
                entity = await this.batchRequestService.find(parseInt(request.batch));
                if(!entity || entity.status != BatchRequestTypesStatus.COMPLETED){
                    throw new InvalidArgumentException("Lote no ha sido encontrado");
                }
                orders = entity.body.map(item => item.order);
                orders = await this.orderService.findByIds(orders);
            }

            const user = await this.getUser(req);

            if(request.batch) {
                let updates = [];
                await Promise.all(orders.map(async entity => {
                    const order = await this.orderService.updateNextStatus(entity, user);
                    await this.orderService.addMayorist(order, true);
                    updates.push(order);
                }));
                entity.status = BatchRequestTypesStatus.EXECUTED;
                await this.batchRequestService.createOrUpdate(entity);
                return res.json({status: 200, updates: updates.map(item => OrderShortDTO(item))});
            } else {
                const order = await this.orderService.updateNextStatus(entity, user);
                await this.orderService.addMayorist(order, true);
                return res.json({status: 200, order: OrderShowDTO(order)});
            }

        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    @route('/:id/counters/increasePhoto')
    @GET()
    public async increasePhoto(req: Request, res: Response) {
        const oldEntity = await this.orderService.find(parseInt(req.params.id), []);
        if(oldEntity){
            oldEntity.photos = oldEntity.photos + 1;
            await this.orderService.update(oldEntity);
            return res.json({status: 200});
        }
    }


    /** Actualizar los productos de un pedido */
    @route('/:id/update/inventary')
    @PUT()
    public async updateInventary(req: Request, res: Response) {
        const _entity = await this.orderService.findFull(req.params.id);
        const user = await this.getUser(req);
        if(_entity) {
            try {
                if (req.body.products && req.body.products.length > 0) {
                    const productsOrders = converterArrayToProductsObject(req.body.products);
                    const _order = await this.orderService.updateOrderDetail(_entity, productsOrders, user, true);
                    await this.orderService.addMayorist(_order, true);
                    return res.json({status: 200, order: OrderShowDTO(_order)});
                }
            }catch(e){
                this.handleException(e, res);
                console.log("error", e);
            }
        }
    }

    /** Actualizar los datos de un pedido */
    @route('/:id')
    @PUT()
    public async update(req: Request, res: Response) {
        try {
            const user = await this.getUser(req);
            const _order = await this.orderService.findFull(req.params.id);
            if(!_order) {
                throw new InvalidArgumentException("No se encontro la orden indicada");
            }

            const parse : OrderUpdate = await OrderUpdateDTO(req.body);

            if(parse.paymentMode) {
                /** Actualización de modos de pagos */
                if (!parse.hasPaymentMode()) {
                    throw new InvalidArgumentException("El modo de pago es invalido");
                }
            }

            const order: Order = await this.orderService.registerOrder(_order, parse, user);
            return res.json({status: 200, order: OrderShowDTO(order)});
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    /**
     * Obtener plantilla de impresión (sencilla)
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
                    isMensajero: order.deliveryMethod.id === OrderTypes.MENSAJERO,
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
     * Obtener plantilla de impresión (masiva)
     * @param req
     * @param res
     */
    @route('/batch/printRequest')
    @GET()
    public async printRequest(req: Request, res: Response) {
        try {
            const limitForQueries = 4000; //Limite para una petición

            const query = req.query;
            const conditional = query.conditional ? query.conditional + "" : null;

            const queryCondition = ConditionalQuery.ConvertIntoConditionalParams(conditional);
            const operationQuery = new OperationQuery(null, null);
            let page = new PageQuery(limitForQueries,0,queryCondition, operationQuery);

            page.setRelations(['orderDelivery', 'customer','customer.state','customer.municipality', 'user', 'deliveryMethod', 'orderDetails', 'orderDetails.product']);

            let orders: Array<Order> = await this.orderService.all(page);

            //let isImpress = true;

            if(orders.length > 0){
                let orderId = 0;
                orders.forEach((item,index,_orders)  => {
                    //Regla para poder ser impresa
                    if(item.status <= OrderStatus.PENDING){
                        //isImpress = false;
                        orderId = item.id;
                        _orders.splice(index, 1);
                    }
                });

                //if(!isImpress){
                    //throw new InvalidArgumentException("Orden : "+orderId+" No puede ser impresa");
                //}
                const qrBatch = [];
                const result = await Promise.all(orders.map(async (order,index, _orders) => {
                    qrBatch[order.id] = await QrBarImage(order.id);
                    const deliveryShortType = getDeliveryShortType(order.orderDelivery.deliveryType);

                    let comments = await this.commentService.getByOrder(order);

                    const object = {
                        order,
                        qrBar: qrBatch[order.id],
                        orderDetails: order.orderDetails,
                        hasPayment: isPaymentMode(order.paymentMode) && (order.deliveryMethod.id === OrderTypes.MENSAJERO),
                        isChargeOnDelivery: isChargeOnDelivery(order.orderDelivery),
                        isCash: isCash(order.paymentMode),
                        isMensajero: order.deliveryMethod.id === OrderTypes.MENSAJERO,
                        hasPiecesForChanges: (order.piecesForChanges && order.piecesForChanges > 0),
                        deliveryShortType: deliveryShortType,
                        hasComments: comments.length > 0,
                        comments: comments
                    };

                    const template = await this.templateService.getTemplate(TemplatesRegisters.PRINT_ORDER, object);
                    if(!template){
                        throw new InvalidArgumentException("No se ha encontrado un resumen para esta orden");
                    } else {
                        return {order: order.id, html: template};
                    }
                }));

                const user = await this.userService.find(req["user"]);

                const save = await this.batchRequestService.createOrUpdate({
                    body: result,
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
        const MENSAJERO = 2;
        const INTERRAPIDISIMO = 1;
        try {
            if (ids.length === 0) {
                throw new InvalidArgumentException("Debe ingresar registros a conciliar");
            }

            const orders = await this.orderService.findByIds(ids);

            let itemSuccess = [];
            let itemFailures = [];

            const user = await this.getUser(req);

            const _previousPayments = [DeliveryTypes.PREVIOUS_PAYMENT, DeliveryTypes.PAY_ONLY_DELIVERY];
            await Promise.all(orders.map(async order => {

                const isMensajeroChargeOnDelivery = order.orderDelivery.deliveryType == DeliveryTypes.CHARGE_ON_DELIVERY && order.deliveryMethod.id === MENSAJERO;
                const isInterrapidisimoChargeOnDelivery = order.orderDelivery.deliveryType == DeliveryTypes.CHARGE_ON_DELIVERY && order.deliveryMethod.id === INTERRAPIDISIMO && order.orderDelivery.tracking !== null;

                if(isMensajeroChargeOnDelivery || isInterrapidisimoChargeOnDelivery){
                    try {
                        await this.orderService.updateNextStatus(order, user);
                        itemSuccess.push(order.id);
                    }catch(e){
                        itemFailures.push(order.id);
                    }
                } else if(order.deliveryMethod.id === INTERRAPIDISIMO && _previousPayments.indexOf(order.orderDelivery.deliveryType)){
                    try {
                        await this.orderService.updateNextStatus(order, user);
                        itemSuccess.push(order.id);
                    }catch(e){
                        itemFailures.push(order.id);
                    }
                } else {
                    try {
                        await this.orderService.updateNextStatus(order, user);
                        itemSuccess.push(order.id);
                    }catch(e){
                        itemFailures.push(order.id);
                    }
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

            if(orders.length == 0){
                return res.json({status: 200, data: "", name: null } );
            }

            const comments : Comment[] = await this.commentService.getByOders(orders);
            if(orders.length > 0) {
                orders.map(item => {
                    item.comments = comments.filter(_comment => parseInt(_comment.idRelated) == item.id);
                });
            }

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
            return ['customer', 'deliveryMethod', 'user', 'customer.municipality', 'customer.state', 'orderDelivery', 'orderDelivery.deliveryLocality', 'bill'];
        } else {
            return ['payment', 'customer', 'deliveryMethod', 'user', 'orderDelivery', 'bill'];
        }
    }

    getGroupRelations(): Array<string> {
        return ['user'];
    }

    @route('/:id/sync/orderDelivery')
    @POST()
    public async syncOrderDelivery(req: Request, res: Response){
        try {
            const id = req.params.id;
            const body = req.body;
            const order : Order = await this.orderService.find(parseInt(id), ['orderDelivery',  'deliveryMethod']);
            order.orderDelivery.sync = body.sync;
            await this.orderDeliveryService.createOrUpdate(order.orderDelivery);
            return res.json({status: 200}).status(200);

        }catch(e){
            console.log("error: ", e.message);
            this.handleException(new ApplicationException(), res);
        }
    }


    @route('/:id/refresh/orderDelivery')
    @GET()
    public async refreshOrderDelivery(req: Request, res: Response){

        try {
            const id = req.params.id;
            const order : Order = await this.orderService.find(parseInt(id), ['orderDelivery',  'deliveryMethod']);
            const orders = [];
            orders.push(order);
            const update = await this.deliveryMethodService.syncDeliveries(orders);
            return res.json({...update, status: 200}).status(200);

        }catch(e){
            console.log("error: ", e.message);
            this.handleException(new ApplicationException(), res);
        }

    }

    @route('/refresh/all/orderDelivery')
    @GET()
    public async refreshAllOrderDelivery(req: Request, res: Response){

        try {
            const orders : Order[] = await this.orderService.findPendingForDelivery();
            const update = await this.deliveryMethodService.syncDeliveries(orders);
            return res.json({...update, status: 200}).status(200);

        }catch(e){
            console.log("error: ", e.message);
            this.handleException(new ApplicationException(), res);
        }

    }

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

    @route('/filterby/conciliations')
    @GET()
    public async forConciliates(req: Request, res: Response){
        try {

            const query = req.query;
            const parametersQuery = this.builderParamsPage(query);
            const queryCondition = parametersQuery.queryCondition;

            const filterStatus = queryCondition.addFieldValue('status', Operator.IN , [OrderStatus.SENT]);
            queryCondition.addCondition(filterStatus.field, filterStatus.value);
            queryCondition.addSub("orderDelivery.deliveryType = :deliveryType", {"deliveryType" : DeliveryTypes.CHARGE_ON_DELIVERY });
            //parametersQuery.queryCondition = queryCondition;

            const parametersOrders = this.builderOrder(query);
            let page = new PageQuery(parametersQuery.limit,parametersQuery.pageNumber,queryCondition, parametersQuery.operationQuery);

            const response = await this.processPaginationIndex(page, parametersOrders, parametersQuery);
            res.json(response);

        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    /** Generar las facturas de ordenes */
    @route('/confirm/received')
    @POST()
    public async markReceived(req: Request, res: Response) {
        const body = req.body;
        const {order} = body;
        try {
            const entity = await this.orderService.findFull(order);
            entity.manualReceived = true;
            await this.orderService.createOrUpdate(entity);
            return res.json({order: entity, status: 200}).status(200);
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }
}
