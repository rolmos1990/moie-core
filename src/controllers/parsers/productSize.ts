import {ProductImage} from "../../models/ProductImage";
import {ProductSize} from "../../models/ProductSize";

export const ProductSizeCreateDTO = (productSize: ProductSize) => ({
    name: productSize.name,
    color: productSize.color,
    quantity: productSize.quantity,
    product: productSize.product
});

export const ProductSizeListDTO = (productSize: ProductSize) => ({
    id: productSize.id,
    name: productSize.name,
    color: productSize.color,
    quantity: productSize.quantity,
    product: productSize.product
});

export const ProductSizeUpdateDTO = (productSize: ProductSize) => ({
    id: productSize.id,
    name: productSize.name,
    color: productSize.color,
    quantity: productSize.quantity,
    product: productSize.product
});
