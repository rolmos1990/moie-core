import {Customer} from "../../models/Customer";
import {converterFirstArrayObject, converterPhoneInColombianFormat} from "../../common/helper/converters";
import {StateShortDTO} from "./state";
import {MunicipalityShortDTO} from "./municipality";
import {IsBoolean, IsDateString, IsOptional, validate} from "class-validator";
import {InvalidArgumentException} from "../../common/exceptions";

const moment = require("moment");

export const CustomerCreateDTO = (customer: Customer) => ({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    document: customer.document,
    cellphone: customer.cellphone,
    isMayorist: false,
    hasNotification: customer.hasNotification ? true : false,
    status: true,
    createdAt: new Date(),
    municipality: customer.municipality || null,
    state: customer.state || null,
    address: customer.address || null,
    updatedAt: null
});

export const CustomerShowDTO = (customer: Customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    document: customer.document,
    phone: converterPhoneInColombianFormat(customer.phone),
    cellphone: converterPhoneInColombianFormat(customer.cellphone),
    isMayorist: customer.isMayorist ? true : false,
    hasNotification: customer.hasNotification ? true : false,
    status: customer.status ? true : false,
    createdAt: customer.createdAt,
    address: customer.address,
    state: StateShortDTO(customer.state) || null,
    municipality: MunicipalityShortDTO(customer.municipality) || null,
    temporalAddress: converterFirstArrayObject(customer.temporalAddress),
    updatedAt: customer.updatedAt
});

export const CustomerListDTO = (customer: Customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    document: customer.document,
    phone:converterPhoneInColombianFormat(customer.phone),
    cellphone: converterPhoneInColombianFormat(customer.cellphone),
    isMayorist: customer.isMayorist ? true : false,
    status: customer.status ? true : false,
    state: StateShortDTO(customer.state) || null,
    municipality: MunicipalityShortDTO(customer.municipality) || null,
    temporalAddress: converterFirstArrayObject(customer.temporalAddress),
    createdAt: customer.createdAt
});

export const CustomerUpdateDTO = (customer: Customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    document: customer.document,
    phone: customer.phone,
    cellphone: customer.cellphone,
    hasNotification: customer.hasNotification,
    status: customer.status,
    municipality: customer.municipality || null,
    state: customer.state || null,
    address: customer.address || null,
    updatedAt: new Date(),
});

export const requestStatDTO = async (request: any) => {
    try {
        request = new RequestStats(request);
        const statErrors = await validate(request);
        console.log("STATS ERRORS", statErrors.length);
        if(statErrors.length > 0){
            const errorMessage = Object.values(statErrors[0].constraints)[0];
            throw new InvalidArgumentException(errorMessage);
        } else {
            return request;
        }
    }catch(e){
        throw new InvalidArgumentException(e.message);
    }
}

export class RequestStats {
    constructor(props) {

        if(props.beforeDate) {
            this.beforeDate = moment(props.beforeDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        }
        if(props.afterDate) {
            this.afterDate = moment(props.afterDate, 'YYYY-MM-DD').format("YYYY-MM-DD");
        }
        console.log("CATEGORY MODE -- ", props.categoryMode);
        this.categoryMode = props.categoryMode && props.categoryMode !== false && props.categoryMode !== "false" ? true : false;
    }
    @IsBoolean({"message": "categoryMode - Debe ser indicado"})
    @IsOptional()
    categoryMode: boolean;

    @IsDateString({},{"message": "$property - Debe ser una fecha valida"})
    @IsOptional()
    beforeDate: Date;

    @IsDateString({},{"message": "$property - Debe ser una fecha valida"})
    @IsOptional()
    afterDate: Date;
}

export const requestOrderStatDTO = async (request: any) => {
    try {
        request = new RequestOrderStats(request);
        const statErrors = await validate(request);
        if(statErrors.length > 0){
            const errorMessage = Object.values(statErrors[0].constraints)[0];
            throw new InvalidArgumentException(errorMessage);
        } else {
            return request;
        }
    }catch(e){
        throw new InvalidArgumentException(e.message);
    }
}

export class RequestOrderStats {
    constructor(props) {

        if(props.beforeDate) {
            this.beforeDate = moment(props.beforeDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        }
        if(props.afterDate) {
            this.afterDate = moment(props.afterDate, 'YYYY-MM-DD').format("YYYY-MM-DD");
        }
    }

    @IsDateString({},{"message": "$property - Debe ser una fecha valida"})
    @IsOptional()
    beforeDate: Date;

    @IsDateString({},{"message": "$property - Debe ser una fecha valida"})
    @IsOptional()
    afterDate: Date;
}

export const CustomerShortDTO = (customer: Customer) => ({
    id: customer ? customer.id : null,
    name: customer ? customer.name : null,
    email: customer ? customer.email : null
});

const stats = (stat) => ({
    id: stat.productId || stat.categoryId,
    sumPrices: stat.sumPrices,
    qty: stat.qty,
    name: stat.name
});

export const Stats = (object: any) => (object && object.length > 0 && object.map(item => stats(item)));

const order_stats = (stat) => ({
    status: stat.status,
    qty: stat.qty,
    sumPrices: stat.sumPrices,
});

export const OrderStats = (object: any) => (object && object.length > 0 && object.map(item => order_stats(item)));
