import {Customer} from "../../models/Customer";
import {converterFirstArrayObject, converterPhoneInColombianFormat} from "../../common/helper/converters";

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
    updatedAt: null
});

export const CustomerListDTO = (customer: Customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    document: customer.document,
    phone:converterPhoneInColombianFormat(customer.phone),
    cellphone: converterPhoneInColombianFormat(customer.cellphone),
    isMayorist: customer.isMayorist ? true : false,
    hasNotification: customer.hasNotification ? true : false,
    status: customer.status ? true : false,
    createdAt: customer.createdAt,
    state: customer.state || null,
    municipality: customer.municipality || null,
    temporalAddress: converterFirstArrayObject(customer.temporalAddress),
    updatedAt: customer.updatedAt
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
    updatedAt: new Date(),
});
