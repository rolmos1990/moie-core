import {Customer} from "../../models/Client";

export const CustomerCreateDTO = (client: Customer) => ({
    name: client.name,
    email: client.email,
    phone: client.phone,
    celphone: client.celphone,
    isMayorist: false,
    hasNotification: client.hasNotification ? true : false,
    status: true,
    createdAt: new Date(),
    municipality: client.municipality || null,
    state: client.state || null,
    updatedAt: null
});

export const CustomerListDTO = (client: Customer) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    celphone: client.celphone,
    isMayorist: client.isMayorist ? true : false,
    hasNotification: client.hasNotification ? true : false,
    status: client.status ? true : false,
    createdAt: client.createdAt,
    state: client.state || null,
    municipality: client.municipality || null,
    updatedAt: client.updatedAt
});

export const CustomerUpdateDTO = (client: Customer) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    celphone: client.celphone,
    hasNotification: client.hasNotification,
    status: client.status,
    municipality: client.municipality || null,
    state: client.state || null,
    updatedAt: new Date(),
});
