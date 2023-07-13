import {BaseController} from "../common/controllers/base.controller";
import {Size} from "../models/Size";
import {GET, route} from "awilix-express";
import {EntityTarget} from "typeorm";
import {Request, Response} from "express";
import {OrderService} from "../services/order.service";
import {UserService} from "../services/user.service";
import {isValidStatTimes} from "../common/enum/statsTimeTypes";
import {InvalidArgumentException} from "../common/exceptions";
import {ProductService} from "../services/product.service";
import {CustomerService} from "../services/customer.service";
import {CachedService} from "../services/cached.service";

@route('/stats')
export class StatsController extends BaseController<Size> {

    constructor(
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private readonly customerService: CustomerService,
        private readonly cachedService: CachedService,
        protected readonly userService: UserService
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

    @route("/estadistica_ventas/:typeDate/:startDate/:endDate/:group/:user?")
    @GET()
    public async estadistica_ventas(req: Request, res: Response) {
        try {
            const fi = req.params.startDate;
            const ff = req.params.endDate;
            const grupo = req.params.group;
            const userId = req.params.user;
            const typeDate = req.params.typeDate || 'sales'; // sale/creation

            if(!isValidStatTimes(grupo)){
                throw new InvalidArgumentException("Agrupacion de fecha no es valida");
            }

            let user = null;

            if(userId && userId != "null"){
                user = await this.userService.find(parseInt(userId));
            }

            const stats = await this.orderService.getStatsDay(fi, ff, grupo.toLowerCase(), user, typeDate);

            return res.json(stats);

        }catch(e){
            this.handleException(e, res);
        }
    }

    @route("/estadistica_ventas_estado/:startDate/:endDate")
    @GET()
    public async estadistica_ventas_estado(req: Request, res: Response) {
        try {
            const fi = req.params.startDate;
            const ff = req.params.endDate;

            const stats = await this.orderService.getStatsStates(fi, ff);

            return res.json(stats);

        }catch(e){
            this.handleException(e, res);
        }
    }

    @route("/estadistica_ventas_origen/:startDate/:endDate/:group")
    @GET()
    public async estadistica_ventas_origen(req: Request, res: Response) {
        try {
            const fi = req.params.startDate;
            const ff = req.params.endDate;
            const grupo = req.params.group;

            if(!isValidStatTimes(grupo)){
                throw new InvalidArgumentException("Agrupacion de fecha no es valida");
            }

            const stats = await this.orderService.getStatsOrigen(fi, ff, grupo.toLowerCase());

            return res.json(stats);


        }catch(e){
            this.handleException(e, res);
        }
    }

    @route("/estadistica_ventas_whatsapp/:startDate/:endDate")
    @GET()
    public async estadistica_ventas_whatsapp(req: Request, res: Response) {
        try {
            const fi = req.params.startDate;
            const ff = req.params.endDate;

            const stats = await this.orderService.getStatsWhatsapp(fi, ff);

            return res.json({...stats});


        }catch(e){
            this.handleException(e, res);
        }
    }

    @route("/estadistica_ventas_tipo/:startDate/:endDate/:group")
    @GET()
    public async estadistica_ventas_tipo(req: Request, res: Response) {
        try {
            const fi = req.params.startDate;
            const ff = req.params.endDate;
            const grupo = req.params.group;

            if(!isValidStatTimes(grupo)){
                throw new InvalidArgumentException("Agrupacion de fecha no es valida");
            }

            const stats = await this.orderService.getStatsTipo(fi, ff, grupo.toLowerCase());

            return res.json(stats);


        }catch(e){
            this.handleException(e, res);
        }
    }

    @route("/estadistica_mas_vendidos/:startDate/:endDate")
    @GET()
    public async estadistica_mas_vendidos(req: Request, res: Response) {
        try {
            const fi = req.params.startDate;
            const ff = req.params.endDate;

            const stats = await this.orderService.getStatsMasVendidos(fi, ff);

            return res.json(stats);


        }catch(e){
            this.handleException(e, res);
        }
    }

    @route("/estadistica_horas/:startDate/:endDate")
    @GET()
    public async estadistica_horas(req: Request, res: Response) {
        try {
            const fi = req.params.startDate;
            const ff = req.params.endDate;

            const stats = await this.orderService.getStatsHoras(fi, ff);

            return res.json(stats);


        }catch(e){
            this.handleException(e, res);
        }
    }

    @route("/estadistica_reincidencias/:startDate/:endDate")
    @GET()
    public async estadistica_reincidencias(req: Request, res: Response) {
        try {
            const fi = req.params.startDate;
            const ff = req.params.endDate;

            const stats = await this.orderService.getStatsReincidencias(fi, ff);

            return res.json(stats);


        }catch(e){
            this.handleException(e, res);
        }
    }


    @route("/estadistica/save_dashboard")
    @GET()
    public async estadistica_save_dashboard(req: Request, res: Response) {
        try {
            const products = await this.productService.getDashboardStat();
            const orders = await this.orderService.getStatDashboard();
            const customers = await this.customerService.getStatDashboard();

            const data = {
                products,
                orders,
                customers
            };

            const cached = await this.cachedService.find('STATS_DASHBOARD');
            cached.json = JSON.stringify(data);
            cached.updatedAt = new Date();

            await this.cachedService.createOrUpdate(cached);

            return res.json({status: 200});

        }catch(e){
            console.log('error e: ', e.message);
            this.handleException(e, res);
        }
    }


    @route("/estadistica/dashboard")
    @GET()
    public async estadistica_dashboard(req: Request, res: Response) {
        try {
            const data = await this.cachedService.find('STATS_DASHBOARD');
            const payload = JSON.parse(data.json);
            return res.json({...payload});

        }catch(e){
            console.log('error e: ', e.message);
            this.handleException(e, res);
        }
    }



    protected getDefaultRelations(): Array<string> {
        return [];
    }

    getEntityTarget(): EntityTarget<Size> {
        return Size;
    }

    getInstance(): Object {
        return new Size();
    }

    getParseGET(entity: Size): Object {
        return entity;
    }

    getParsePOST(entity: Size): Object {
        return entity;
    }

    getParsePUT(entity: Size): Object {
        return entity;
    }
    getGroupRelations(): Array<string> {
        return [];
    }

}
