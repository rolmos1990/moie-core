import {Attachment} from "../../models/Attachment";
import {Items} from "../../models/Items";
import {CONFIG_MEDIA} from "../../services/mediaManagement.service";

export const ItemsListDTO = (item: Items) => ({
    id: item ? item.id : null,
    amount: item ? item.amount : null,
    type: item ? item.type : null,
    user: item ? item.user : null,
    createdAt: item.createdAt
});

export const ItemsDetailDTO = (item: Items) => ({
    id: item ? item.id : null,
    amount: item ? item.amount : null,
    type: item ? item.type : null,
    user: item ? item.user : null,
    createdAt: item.createdAt
});
