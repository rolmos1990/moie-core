import {route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {ProductSize} from "../models/ProductSize";
import {ProductSizeService} from "../services/productSize.service";
import {ProductService} from "../services/product.service";
import {ProductSizeCreateDTO, ProductSizeListDTO, ProductSizeUpdateDTO} from "./parsers/productSize";

@route('/productSize')
export class ProductSizeController extends BaseController<ProductSize> {
    constructor(
        private readonly productSizeService: ProductSizeService
    ){
        super(productSizeService);
    };

    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    protected getDefaultRelations(): Array<string> {
        return ['product'];
    }

    getEntityTarget(): EntityTarget<ProductSize> {
        return ProductSize;
    }

    getInstance(): Object {
        return new ProductSize;
    }

    getParseGET(entity: ProductSize): Object {
        return ProductSizeListDTO(entity);
    }

    getParsePOST(entity: ProductSize): Object {
        return ProductSizeCreateDTO(entity);
    }

    getParsePUT(entity: ProductSize): Object {
        return ProductSizeUpdateDTO(entity);;
    }

}
