import {route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {User} from "../models/User";
import {EntityTarget} from "typeorm";
import {BillConfigCreateDTO, BillConfigListDTO} from "./parsers/billConfig";
import {BillConfig} from "../models/BillConfig";
import {BillConfigService} from "../services/billConfig.service";
import {UserService} from "../services/user.service";

@route('/billConfig')
export class BillController extends BaseController<BillConfig> {
    constructor(
        private readonly billConfigService: BillConfigService,
        private readonly userService: UserService,
    ){
        super(billConfigService, userService );
    };

    protected afterCreate(item: Object, user: User | undefined): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    protected getDefaultRelations(isDetail: boolean): Array<string> {
        return [];
    }

    getEntityTarget(): EntityTarget<BillConfig> {
        return BillConfig;
    }

    getGroupRelations(): Array<string> {
        return [];
    }

    getInstance(): BillConfig {
        return new BillConfig();
    }

    getParseGET(entity: BillConfig, isDetail: boolean): Object {
        return BillConfigListDTO(entity);
    }

    getParsePOST(entity: BillConfig): Object {
        return BillConfigCreateDTO(entity);
    }

    getParsePUT(entity: BillConfig): Object {
        return BillConfigListDTO(entity);
    }

}
