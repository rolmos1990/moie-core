import {UserShortDTO} from "./user";

export const OrderHistoricDTO = (historic) => ({
    id: historic && historic.id,
    status: historic && historic.status,
    createdAt: historic && historic.createdAt,
    user: UserShortDTO(historic.user)
});


export const OrderHistoricListDTO = (historics) => historics && historics.length > 0 ? historics.map(item => OrderHistoricDTO(item)) : [];
