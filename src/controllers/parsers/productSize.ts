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

export const ProductOrderCreate = (product: any) => ({
    discountPercentage: product.discountPercentage,
    id: product.id,
    productSize: product.size,
    quantity: product.quantity
});

export const ProductSizeShort = (productSize: any) => ({
    id: productSize.id || null,
    quantity: productSize.quantity || 0
});
