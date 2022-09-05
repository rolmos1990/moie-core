import {DeliveryMethodListDTO} from "./deliveryMethod";
import {Office} from "../../models/Office";
import {UserShortDTO} from "./user";

export const OfficeListDTO = (item: Office) => ({
    id: item ? item.id : null,
    batchDate: item ? item.batchDate : null,
    name: item ? item.name : null,
    type: item ? item.type : null,
    deliveryMethod: DeliveryMethodListDTO(item.deliveryMethod),
    description: item ? item.description : null,
    user: item ? UserShortDTO(item.user) : null,
    status: item.status,
    viewOrders: item.viewOrders || {}
});

export const OfficeCreateDTO = (item: Office) => ({
    id: item ? item.id : null,
    batchDate: item ? item.batchDate : null,
    name: item ? item.name : null,
    type: item ? item.type : null,
    deliveryMethod: item.deliveryMethod,
    description: item.description,
    user: item.user,
    status: 1, //Pending
});
