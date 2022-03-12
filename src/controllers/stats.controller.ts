import {BaseController} from "../common/controllers/base.controller";
import {Size} from "../models/Size";
import {GET, route} from "awilix-express";
import {EntityTarget} from "typeorm";
import {Request, Response} from "express";
import {OrderService} from "../services/order.service";
import {UserService} from "../services/user.service";

@route('/stats')
export class StatsController extends BaseController<Size> {

    constructor(
        private readonly orderService: OrderService,
        private readonly userService: UserService
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

    @route("/estadistica_ventas/:startDate/:endDate/:grupo")
    @GET()
    public async estadistica_ventas(req: Request, res: Response) {
        try {
            const fi = req.params.startDate;
            const ff = req.params.endDate;
            const grupo = req.params.grupo;

            const userIdFromSession = req['user'].id;
            const user = await this.userService.find(userIdFromSession);

            const stats = await this.orderService.getStatsDay(fi, ff, grupo, user);

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

            const stats = await this.orderService.getStatsOrigen(fi, ff, grupo);

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
            const group = req.params.group;

            const stats = await this.orderService.getStatsTipo(fi, ff, group);

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
