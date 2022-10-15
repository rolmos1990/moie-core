import {BaseController} from "../common/controllers/base.controller";
import {ProductImage} from "../models/ProductImage";
import {EntityTarget} from "typeorm";
import {DELETE, PUT, route} from "awilix-express";
import {ProductImageService} from "../services/productImage.service";
import {ProductImageCreateDTO, ProductImageListDTO, ProductImageUpdateDTO} from "./parsers/productImage";
import {Request, Response} from "express";
import {isArray} from "util";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {ProductImageCreate} from "../common/interfaces/Product";
import {ProductService} from "../services/product.service";
import {Product} from "../models/Product";

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
            const product = await this.productService.find(parseInt(id), ['category']);

            if(!product){
                throw new InvalidArgumentException();
            }

            const result = body.map(async item => {
                const filename = product.reference + "_" + item.group;
                await this.productImageService.addProductImages(product, item.group, filename ,item.file);
            });


            await Promise.all(result);

            return res.json({status: 200});
        }catch(e){
            this.handleException(e, res);
        }
    }

    @route('/deleteImage/:id/:number')
    @DELETE()
    protected async deleteImage(req: Request, res: Response){
        const id = req.params.id;
        const number = req.params.number;
        try {
            if (id) {
                const product: Product = await this.productService.find(parseInt(id), ['productImage']);

                if(product.productImage[number]){
                    const thumbs = {
                        small: null,
                        medium: null,
                        high: null
                    };

                    try {
                        //await this.productImageService.removeProductImage(product.productImage[number]);
                    }catch(e){
                        console.log("cannot delete files");
                    }

                    product.productImage[number].thumbs = thumbs;
                    product.productImage[number].path = null;
                    await this.productImageService.createOrUpdate(product.productImage);

                    return res.json({status: 200 } );
                }
            } else {
                throw new InvalidArgumentException();
            }
        }catch(e){
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Producto no ha sido encontrado"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
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
    getGroupRelations(): Array<string> {
        return [];
    }
}
