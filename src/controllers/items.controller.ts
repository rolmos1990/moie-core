import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {GET, route} from "awilix-express";
import {Items} from "../models/Items";
import {ItemsService} from "../services/items.service";
import {ItemsDetailDTO, ItemsListDTO} from "./parsers/items";
import {UserService} from "../services/user.service";
import {Request, Response} from "express";

@route('/items')
export class ItemsController extends BaseController<Items> {
    constructor(
        private readonly itemsService: ItemsService,
        protected readonly userService: UserService
    ){
        super(itemsService, userService);
    };
    protected async afterCreate(item: Items) : Promise<void> {
        console.log('after create here...');
        console.log('items: ', item);
        await this.itemsService.increaseEvent(item.type, item.amount);
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Items): void {
        const syncDate = new Date();
        item.createdAt = syncDate;

    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<Items> {
        return Items;
    }

    getInstance(): Object {
        return new Items();
    }

    getParseGET(entity: Items, isDetail): Object {
        if(isDetail){
            return ItemsDetailDTO(entity);
        } else {
            return ItemsListDTO(entity);
        }
    }

    getParsePOST(entity: Items): Object {
        return entity;
    }

    getParsePUT(entity: Items): Object {
        return entity;
    }

    protected getDefaultRelations(isDetail): Array<string> {
        if(isDetail) {
            return ['user'];
        } else {
            return ['user'];
        }
    }
    getGroupRelations(): Array<string> {
        return ['user'];
    }

    /** Start - Configuration for AutoSave User */
    protected autoSaveUser?(): boolean {
        return true;
    }

    protected getUserService(){
        return this.userService;
    }


    //CUSTOM SERVICES


    @route('/get/events')
    @GET()
    public async getEvent(req: Request, res: Response) {
        try {
            const events = await this.itemsService.getEvents();
            return res.json({event: events}).status(200);
        }catch(e){
            this.handleException(e, res);
        }
    }

}
