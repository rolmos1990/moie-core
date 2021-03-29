import {BaseController} from "../common/controllers/base.controller";
import {ProductImage} from "../models/ProductImage";
import {EntityTarget} from "typeorm";
import {route} from "awilix-express";
import {ProductImageService} from "../services/productImage.service";
import {ProductImageCreateDTO, ProductImageListDTO, ProductImageUpdateDTO} from "./parsers/productImage";

@route('/productImage')
export class ProductImageController extends BaseController<ProductImage> {
    constructor(
        private readonly productImageService: ProductImageService
    ){
        super(productImageService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<ProductImage> {
        return ProductImage;
    }

    getInstance(): Object {
        return new ProductImage();
    }

    getParseGET(entity: ProductImage): Object {
        return ProductImageListDTO(entity);
    }

    getParsePOST(entity: ProductImage): Object {
        return ProductImageCreateDTO(entity);
    }

    getParsePUT(entity: ProductImage): Object {
        return ProductImageUpdateDTO(entity);
    }

    protected getDefaultRelations(): Array<string> {
        return ['product'];
    }
}
