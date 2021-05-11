import {BaseController} from "../common/controllers/base.controller";
import {Customer} from "../models/Customer";
import {EntityTarget} from "typeorm";
import {CustomerService} from "../services/customer.service";
import {route} from "awilix-express";
import {CustomerCreateDTO, CustomerListDTO, CustomerShowDTO, CustomerUpdateDTO} from "./parsers/customer";
import { PageQuery } from "../common/controllers/page.query";

@route('/customer')
export class CustomerController extends BaseController<Customer> {
    constructor(
        private readonly customerService: CustomerService
    ){
        super(customerService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<Customer> {
        return Customer;
    }

    getInstance(): Object {
        return new Customer();
    }

    getParseGET(entity: Customer, isDetail: boolean): Object {
        if(isDetail){
            return CustomerShowDTO(entity);
        }
        else{
            return CustomerListDTO(entity);
        }
    }

    getParsePOST(entity: Customer): Object {
        return CustomerCreateDTO(entity);
    }

    getParsePUT(entity: Customer): Object {
        return CustomerUpdateDTO(entity);
    }

    protected getDefaultRelations(isDetail: boolean): Array<string> {
        if(isDetail){
            return ['municipality', 'state', 'temporalAddress'];
        } else {
            return ['municipality', 'state'];
        }
    }
}
