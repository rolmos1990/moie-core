import {Product} from "../../models/Product";

export const ProductCreateDTO = (product: Product) => ({
    name: product.name,
    reference: product.reference,
    material: product.material,
    provider: product.provider,
    category: product.category,
    description: product.description || "",
    price: product.price,
    cost: product.cost,
    discount: product.discount || 0,
    weight: product.weight,
    size: product.size,
    published: product.published,
    status: product.status,
    tags: product.tags || null,
    referenceKey: product.referenceKey
});

export const ProductUpdateDTO = (product: Product) => ({
    id: product.id,
    name: product.name,
    reference: product.reference,
    material: product.material,
    provider: product.provider,
    category: product.category,
    description: product.description || "",
    price: product.price ? product.price.toFixed(2) : 0,
    cost: product.cost ? product.cost.toFixed(2) : 0,
    discount: product.discount || 0,
    weight: product.weight ? product.weight.toFixed(2) : 0,
    size: product.size || null,
    published: product.published,
    status: product.status,
    tags: product.tags || null,
});
