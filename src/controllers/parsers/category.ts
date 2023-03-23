import {Category} from "../../models/Category";

export const CategoryCreateDTO = (category: Category) => ({
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    status: category.status,
    discountPercent: category.discountPercent ? parseFloat(category.discountPercent.toString()) : null,
    filename: category.filename,
    filenameBanner: category.filenameBanner,
    filenameCatalog: category.filenameCatalog
});

export const CategoryListDTO = (category: Category) => ({
    id: category.id,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    status: category.status,
    filename: category.filename,
    discountPercent: category.discountPercent ? parseFloat(category.discountPercent.toString()) : null,
    filenameBanner: category.filenameBanner,
    filenameCatalog: category.filenameCatalog
});

export const CategoryUpdateDTO = (category: Category) => ({
    id: category.id,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    status: category.status,
    discountPercent: category.discountPercent ? parseFloat(category.discountPercent.toString()) : null,
    filename: category.filename,
    filenameBanner: category.filenameBanner,
    filenameCatalog: category.filenameCatalog
});

export const CategoryShortDTO = (category: Category) => ({
    id: category.id,
    name: category.name,
    discountPercent: category.discountPercent ? parseFloat(category.discountPercent.toString()) : null,
});
