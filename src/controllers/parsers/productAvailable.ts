import {ProductAvailable} from "../../models/ProductAvailable";

export const ProductAvailableDTO = (available: ProductAvailable) => ({
    available: available.available || 0,
    reserved: available.reserved || 0,
    completed: available.completed || 0
});
