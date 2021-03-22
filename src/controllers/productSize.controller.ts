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

interface RequestInventary {
    name: string,
    color: string,
    qty: number
};

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

    @route("/:id/inventary")
    @POST()
    public async changeInventary(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const sizesValues: Array<RequestInventary> = req.body || [];
            if (id) {
                const product = await this.productService.find(parseInt(id));
                const productSizes: ProductSize[] = await this.productSizeService.findByProduct(parseInt(id));
                //TODO - Agregar una validación para recorrer la estructura de nombres y coincida con la plantilla.
                if (!product.isEmpty() && product.size) {
                    if (!productSizes.length) {
                        //its empty
                        sizesValues.forEach(item => {
                            let prodSize = new ProductSize();
                            prodSize.name = item.name;
                            prodSize.quantity = item.qty;
                            prodSize.color = item.color;
                            prodSize.product = product;
                            productSizes.push(prodSize);
                        });
                    } else {
                        sizesValues.forEach(({name, color, qty}) => {
                            const exists = productSizes.filter(item => item.name === name);
                            if(!isEmpty(exists)) {
                                //modificamos existente
                                productSizes.map(item => {
                                    if (item.name === name) {
                                        item.color = color;
                                        item.quantity = qty;
                                    }
                                });
                            } else {
                                //creamos el nuevo identificador
                                const prodSize = new ProductSize();
                                prodSize.name = name;
                                prodSize.quantity = qty;
                                prodSize.color = color;
                                prodSize.product = product;
                                productSizes.push(prodSize);
                            }
                        });
                    }

                    await Promise.all(productSizes.map(item => {
                        this.productSizeService.createOrUpdate(item);
                    }));

                    return res.json({status: 200});

                }
                else if(!product.size){
                    throw new InvalidArgumentException("Producto debe tener asignada una plantilla de tallas.");
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
