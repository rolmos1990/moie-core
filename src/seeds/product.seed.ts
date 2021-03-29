import {Category} from "../models/Category";
import {Size} from "../models/Size";

const category = new Category();
category.id = 1;
const size = new Size();
size.id = 1;

export const ProductSeed = [
    {
        name: "Producto 1",
        reference: "A1236782",
        material: "Material de Prueba",
        provider: "Proveedor de Prueba",
        tags: "XL XS XR",
        category: category,
        size: size,
        description: "Producto de Prueba",
        price: "3.00",
        cost: "0.25",
        weight: "2.00",
        status: true
    },
    {
        name: "Producto 2",
        reference: "B13211122",
        material: "Material de Prueba",
        provider: "Proveedor de Prueba",
        tags: "XL XS XR",
        category: category,
        size: size,
        description: "Producto de Prueba",
        price: "2.00",
        cost: "0.50",
        weight: "1.00",
        status: true
    },
    {
        name: "Producto 3",
        reference: "B13211123",
        material: "Material de Prueba",
        provider: "Proveedor de Prueba",
        tags: "XL XS XR",
        category: category,
        size: size,
        description: "Producto de Prueba",
        price: "2.00",
        cost: "0.50",
        weight: "1.00",
        status: true
    }
];
