import {DeliveryMethod} from "../../models/DeliveryMethod";

export const DeliveryMethodListDTO = (deliveryMethod: DeliveryMethod) => ({
    id: deliveryMethod ? deliveryMethod.id : null,
    code: deliveryMethod ? deliveryMethod.code : null,
    name: deliveryMethod ? deliveryMethod.name : null,
});

export const DeliveryMethodShortListDTO = (deliveryMethod: DeliveryMethod) => ({
    name: deliveryMethod ? deliveryMethod.name : null,
});
