import {DeliveryLocality} from "../../models/DeliveryLocality";

export const DeliveryLocalityListDTO = (deliveryLocality: DeliveryLocality) => ({
    id: deliveryLocality ? deliveryLocality.id : null,
    name: deliveryLocality ? deliveryLocality.name : null,
});

export const DeliveryLocalityListShortDTO = (deliveryLocality: DeliveryLocality) => ({
    name: deliveryLocality ? deliveryLocality.name : null,
});
