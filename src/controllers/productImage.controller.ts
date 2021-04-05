import {BaseController} from "../common/controllers/base.controller";
import {ProductImage} from "../models/ProductImage";
import {EntityTarget} from "typeorm";
import {PUT, route} from "awilix-express";
import {ProductImageService} from "../services/productImage.service";
import {ProductImageCreateDTO, ProductImageListDTO, ProductImageUpdateDTO} from "./parsers/productImage";
import {Request, Response} from "express";
import {isArray} from "util";
import {InvalidArgumentException} from "../common/exceptions";
import {ProductImageCreate} from "../common/interfaces/Product";
import {ProductService} from "../services/product.service";

@route('/changeProductImage')
export class ProductImageController extends BaseController<ProductImage> {
    constructor(
        private readonly productImageService: ProductImageService,
        private readonly productService: ProductService
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

    @route('/:id')
    @PUT()
    public async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const body = req.body;
            const product = await this.productService.find(parseInt(id));

            if(!product){
                throw new InvalidArgumentException();
            }
            const filename = product.reference + "_" + body.group;
            await this.productImageService.addProductImages(product, body.group, filename ,body.file);
            return res.json({status: 200});
        }catch(e){
            this.handleException(e, res);
        }
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
