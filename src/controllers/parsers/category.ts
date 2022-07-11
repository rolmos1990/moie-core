import {Category} from "../../models/Category";

export const CategoryCreateDTO = (category: Category) => ({
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    status: category.status,
    discountPercent: category.discountPercent ? parseFloat(category.discountPercent.toString()) : null,
    filename: category.filename
});

export const CategoryUpdateDTO = (category: Category) => ({
    id: category.id,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    status: category.status,
    discountPercent: category.discountPercent ? parseFloat(category.discountPercent.toString()) : null,
    filename: category.filename
});
