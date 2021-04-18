import {POST, PUT, route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {Product} from "../models/Product";
import {EntityTarget} from "typeorm";
import {ProductService} from "../services/product.service";
import {ProductCreateDTO, ProductUpdateDTO} from "./parsers/product";
import {IProductSize} from "../common/interfaces/IProductSize";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {ProductSizeService} from "../services/productSize.service";
import {Request, Response} from "express";

@route('/product')
export class ProductController extends BaseController<Product> {
    constructor(
        private readonly productService: ProductService,
        private readonly productSizeService: ProductSizeService,
    ){
        super(productService, productSizeService);
    };

    protected async afterCreate(item: Object): Promise<any> {
    }

    protected afterUpdate(item: Object): void {
    }

    protected async beforeCreate(item: Product): Promise<any> {
        const newReference = await this.productService.getReference(item.size.id);
        item.reference = newReference;
    }

    protected beforeUpdate(item: Object): void {
    }

    @route('/:id/changeSize')
    @POST()
    protected async changeSize(req: Request, res: Response){
        const id = req.params.id;
        try {
            const sizesValues: Array<IProductSize> = req.body || [];
            if (id) {
                const product : Product = await this.productService.find(parseInt(id), ['size']);
                this.productSizeService.changeProductSize(product, sizesValues);
                return res.json({status: 200 } );
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

    protected getDefaultRelations(): Array<string> {
        return ['size','category','productImage', 'productSize'];
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
