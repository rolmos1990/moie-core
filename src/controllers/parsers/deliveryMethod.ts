import {DeliveryMethod} from "../../models/DeliveryMethod";

export const DeliveryMethodListDTO = (deliveryMethod: DeliveryMethod) => ({
    id: deliveryMethod.id,
    code: deliveryMethod.code,
    name: deliveryMethod.name,
});
