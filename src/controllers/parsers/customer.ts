import {Client} from "../../models/Client";
import {converterPhoneInColombianFormat} from "../../common/helper/converters";

export const CustomerCreateDTO = (client: Client) => ({
    name: client.name,
    email: client.email,
    phone: client.phone,
    document: client.document,
    cellphone: client.cellphone,
    isMayorist: false,
    hasNotification: client.hasNotification ? true : false,
    status: true,
    createdAt: new Date(),
    municipality: client.municipality || null,
    state: client.state || null,
    updatedAt: null
});

export const CustomerListDTO = (client: Client) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    document: client.document,
    phone:converterPhoneInColombianFormat(client.phone),
    cellphone: converterPhoneInColombianFormat(client.cellphone),
    isMayorist: client.isMayorist ? true : false,
    hasNotification: client.hasNotification ? true : false,
    status: client.status ? true : false,
    createdAt: client.createdAt,
    state: client.state || null,
    municipality: client.municipality || null,
    updatedAt: client.updatedAt
});

export const CustomerUpdateDTO = (client: Client) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    document: client.document,
    phone: client.phone,
    cellphone: client.cellphone,
    hasNotification: client.hasNotification,
    status: client.status,
    municipality: client.municipality || null,
    state: client.state || null,
    updatedAt: new Date(),
});
