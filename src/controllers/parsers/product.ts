import {Product} from "../../models/Product";
import {ProductImageShortDTO} from "./productImage";
import {ProductAvailableDTO} from "./productAvailable";
import {CustomerShortDTO} from "./customer";

export const ProductListDTO = (product: Product) => ({
    id: product.id,
    name: product.name,
    reference: product.reference,
    material: product.material,
    provider: product.provider,
    providerReference: product.providerReference,
    category: product.category,
    description: product.description || "",
    price: product.price,
    discount: product.discount || 0,
    weight: product.weight,
    published: product.published,
    tags: product.tags || null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    status: product.status,
    productImage: product.productImage,
    productAvailable: product.productAvailable && ProductAvailableDTO(product.productAvailable),
    productSize: product.productSize,
    cost: product.cost,
    orden: product.orden || 0,
});

export const ProductDetailDTO = (product: Product) => ({
    id: product.id,
    name: product.name,
    reference: product.reference,
    material: product.material,
    provider: product.provider,
    providerReference: product.providerReference,
    category: product.category,
    description: product.description || "",
    price: product.price,
    cost: product.cost,
    weight: product.weight,
    discount: product.discount || 0,
    published: product.published,
    tags: product.tags || null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    status: product.status,
    productImage: product.productImage,
    size: product.size,
    productSize: product.productSize,
    productAvailable: product.productAvailable && ProductAvailableDTO(product.productAvailable),
    sizeDescription: product.sizeDescription || null
});

export const ProductCreateDTO = (product: Product) => ({
    name: product.name,
    reference: product.reference,
    material: product.material,
    provider: product.provider,
    providerReference: product.providerReference,
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
    referenceKey: product.referenceKey,
    sizeDescription: product.sizeDescription || null
});

export const ProductUpdateDTO = (product: Product) => ({
    id: product.id,
    name: product.name,
    reference: product.reference,
    material: product.material,
    provider: product.provider,
    providerReference: product.providerReference,
    category: product.category,
    description: product.description || "",
    price: product.price ? product.price : 0,
    cost: product.cost ? product.cost : 0,
    discount: product.discount || 0,
    weight: product.weight ? product.weight : 0,
    //size: product.size || null, //No se debe actualizar la talla bajo ningun concepto
    published: product.published,
    status: product.status,
    tags: product.tags || null,
    sizeDescription: product.sizeDescription || null,
    orden: product.orden || 0,
});

export const ProductQuoteDTO = (products) => products.map(product => ({
    id: product.id,
    qty: product.qty
}));

export const ProductShortDTO = (product) => ({
    reference: product.reference,
    name: product.name,
    productImage: product.productImage && product.productImage.map(item => ProductImageShortDTO(item))
});

export const ProductPendingsDTO = (product: any) => ({
    color: product.color,
    size: product.size,
    quantity: product.quantity,
    order: {
        id: product.order.id,
        status: product.order.status,
        createdAt: product.order.createdAt,
        updatedAt: product.order.updatedAt
    },
    customer: CustomerShortDTO(product.order.customer)
});
