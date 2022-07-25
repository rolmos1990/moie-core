import {DELETE, GET, POST, PUT, route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {Product} from "../models/Product";
import {EntityTarget} from "typeorm";
import {ProductService} from "../services/product.service";
import {
    ProductCreateDTO,
    ProductDetailDTO,
    ProductListDTO,
    ProductPendingsDTO,
    ProductUpdateDTO
} from "./parsers/product";
import {IProductSize} from "../common/interfaces/IProductSize";
import {ApplicationException, InvalidArgumentException} from "../common/exceptions";
import {ProductSizeService} from "../services/productSize.service";
import {Request, Response} from "express";
import {OrderService} from "../services/order.service";
import {PageQuery} from "../common/controllers/page.query";
import {OrderConditional} from "../common/enum/order.conditional";
import {ProductImageService} from "../services/productImage.service";

@route('/product')
export class ProductController extends BaseController<Product> {
    constructor(
        private readonly productService: ProductService,
        private readonly productSizeService: ProductSizeService,
        private readonly orderService: OrderService,
        private readonly productImageService: ProductImageService,
    ){
        super(productService, productSizeService);
    };

    protected async afterCreate(item: Object): Promise<any> {
    }

    protected afterUpdate(item: Object): void {
    }

    protected async beforeCreate(item: Product): Promise<any> {
        if(!item.referenceKey){
            throw new InvalidArgumentException("El indicador de referencia es requerido");
        }
        const newReference = await this.productService.getReference(item.referenceKey);
        item['reference'] = newReference;

        if(item['category']){
            const _nextOrden = await this.productService.getNextOrder(item['category']);
            item['orden'] = _nextOrden;
        }
    }

    protected async beforeUpdate(item: Object, olditem: Object): Promise<any> {
        const oldItem = this.productService.find(item['id'], ['category']);
        if(item && item['category'] != oldItem['category']){
            const _nextOrden = await this.productService.getNextOrder(item['category']);
            item['orden'] = _nextOrden;
        }
    }

    @route('/:id/productPendings')
    @GET()
    /**
     * Product Pendings
     * @param req
     * @param res
     * @protected
     */
    protected async getProductPendings(req: Request, res: Response){
        const id = req.params.id;
        try {
            let products = await this.orderService.getOrderDetailByProductIdAndStatuses(id, [1,2]);
            return res.json({status: 200, products: products.map(item => ProductPendingsDTO(item)) } );
        }catch(e){
            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Producto no ha sido encontrado"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    @route('/:id/changeSize')
    @POST()
    protected async changeSize(req: Request, res: Response){
        const id = req.params.id;
        try {
            const sizesValues: Array<IProductSize> = req.body || [];
            if (id) {
                const product : Product = await this.productService.find(parseInt(id), ['size']);
                await this.productSizeService.changeProductSize(product, sizesValues);
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

    @route('/:id/reorder')
    @POST()
    protected async reorder(req: Request, res: Response){
        const id = req.params.id;
        try {
            const {orden, category} = req.body;
            if(orden){
                const product : Product = await this.productService.find(parseInt(id));
                const productAffected : Product = (await this.productService.findByObject({orden: orden, category: category}))[0];

                //if exists some product affected
                if(productAffected){
                    productAffected.orden = product.orden || 0;
                    product.orden = orden;
                    await this.productService.createOrUpdate(productAffected);
                }

                await this.productService.createOrUpdate(product);

                return res.json({status: 200 } );
            } else {
                throw new InvalidArgumentException();
            }
        }catch(e){

            console.log("message error: ", e.message);

            if (e.name === InvalidArgumentException.name || e.name === "EntityNotFound") {
                this.handleException(new InvalidArgumentException("Producto no ha sido encontrado"), res);
            }
            else{
                this.handleException(new ApplicationException(), res);

            }
        }
    }

    protected getDefaultRelations(): Array<string> {
        return ['size','category','productImage', 'productSize', 'productAvailable'];
    }

    getEntityTarget(): EntityTarget<Product> {
        return Product;
    }

    getInstance(): Object {
        return new Product();
    }

    getParseGET(entity: Product, isDetail: boolean): Object {
        if(isDetail) {
            return ProductDetailDTO(entity);
        } else {
            return ProductListDTO(entity);
        }
    }

    getParsePOST(entity: Product): Object {
        return ProductCreateDTO(entity);
    }

    getParsePUT(entity: Product): Object {
        return ProductUpdateDTO(entity);
    }
    getGroupRelations(): Array<string> {
        return [];
    }

    protected customDefaultOrder(page: PageQuery) {
        page.addOrder('reference', OrderConditional.ASC);
    }

}
