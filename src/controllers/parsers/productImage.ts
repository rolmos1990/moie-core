import {ProductImage} from "../../models/ProductImage";

export const ProductImageCreateDTO = (productImage: ProductImage) => ({
    group: productImage.group,
    thumbs: productImage.thumbs,
    filename: productImage.filename,
    path: productImage.path,
    product: productImage.product
});

export const ProductImageListDTO = (productImage: ProductImage) => ({
    id: productImage.id,
    group: productImage.group,
    thumbs: productImage.thumbs,
    filename: productImage.filename,
    path: productImage.path,
    product: productImage.product
});

export const ProductImageUpdateDTO = (productImage: ProductImage) => ({
    id: productImage.id,
    group: productImage.group,
    thumbs: productImage.thumbs,
    filename: productImage.filename,
    path: productImage.path,
    product: productImage.product
});
