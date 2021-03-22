import {route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {Product} from "../models/Product";
import {EntityTarget} from "typeorm";
import {ProductService} from "../services/product.service";
import {ProductCreateDTO, ProductUpdateDTO} from "./parsers/product";

@route('/product')
export class ProductController extends BaseController<Product> {

    constructor(
        private readonly productService: ProductService
    ){
        super(productService);
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
        return ['size','category'];
    }

    getEntityTarget(): EntityTarget<Product> {
        return Product;
    }

    getInstance(): Object {
        return new Product();
    }

    getParseGET(entity: Product): Object {
        return entity;
    }

    getParsePOST(entity: Product): Object {
        return ProductCreateDTO(entity);
    }

    getParsePUT(entity: Product): Object {
        return ProductUpdateDTO(entity);
    }

}
