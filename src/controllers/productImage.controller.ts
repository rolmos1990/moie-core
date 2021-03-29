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

@route('/changeProductImage')
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

    @route('/:id')
    @PUT()
    public async update(req: Request, res: Response) {
        try {
            const body = req.body;
            if(!isArray(body)){
                throw new InvalidArgumentException("No se ha podido procesar las imagenes");
            }
            const productImages : Array<ProductImageCreate> = [];
            body.forEach(item => {
                productImages.push(item);
            });
            const response = await this.productImageService.addProductImages('filename', productImages);
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
