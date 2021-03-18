import {Client} from "../../models/Client";

export const CustomerCreateDTO = (client: Client) => ({
    name: client.name,
    email: client.email,
    phone: client.phone,
    celphone: client.celphone,
    isMayorist: false,
    hasNotification: client.hasNotification ? true : false,
    status: true,
    createdAt: new Date(),
    municipality: client.municipality,
    updatedAt: null
});
