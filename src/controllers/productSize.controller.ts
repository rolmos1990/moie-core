import {POST, route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {ProductSize} from "../models/ProductSize";
import {ProductSizeService} from "../services/productSize.service";
import {Request, Response} from "express";
import {ProductService} from "../services/product.service";
import {Product} from "../models/Product";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {isEmpty} from "../common/helper/helpers";
import {IProductSize} from "../common/interfaces/IProductSize";

@route('/productSize')
export class ProductSizeController extends BaseController<ProductSize> {
    constructor(
        private readonly productSizeService: ProductSizeService,
        private readonly productService: ProductService
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
        return undefined;
    }

    getEntityTarget(): EntityTarget<ProductSize> {
        return undefined;
    }

    getInstance(): Object {
        return undefined;
    }

    getParseGET(entity: ProductSize): Object {
        return undefined;
    }

    getParsePOST(entity: ProductSize): Object {
        return undefined;
    }

    getParsePUT(entity: ProductSize): Object {
        return undefined;
    }

}
