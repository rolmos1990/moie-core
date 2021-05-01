import {ProductQuoteDTO} from "./product";

export const RequestQuoteDTO = (request) => ({
    deliveryType: request.deliveryType,
    deliveryMethodCode: request.deliveryMethodCode,
    products: ProductQuoteDTO(request.products)
});
