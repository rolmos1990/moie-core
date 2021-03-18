import {BaseController} from "../common/controllers/base.controller";
import {Client} from "../models/Client";
import {EntityTarget} from "typeorm";
import {ClientService} from "../services/client.service";
import {route} from "awilix-express";
import {CustomerCreateDTO} from "./parsers/customer";

@route('/customer')
export class ClientController extends BaseController<Client> {
    constructor(
        private readonly clientService: ClientService
    ){
        super(clientService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<Client> {
        return Client;
    }

    getInstance(): Object {
        return new Client();
    }

    getParseGET(entity: Client): Object {
        return entity;
    }

    getParsePOST(entity: Client): Object {
        return CustomerCreateDTO(entity);
    }

    getParsePUT(entity: Client): Object {
        return entity;
    }

}
