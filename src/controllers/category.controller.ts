import {GET, route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {Category} from "../models/Category";
import {EntityTarget} from "typeorm";
import {CategoryService} from "../services/category.service";
import {Request, Response} from "express";
import {ConditionalQuery} from "../common/controllers/conditional.query";
import {OperationQuery} from "../common/controllers/operation.query";
import {PageQuery} from "../common/controllers/page.query";
import {Order} from "../models/Order";
import {OrderStatus} from "../common/enum/orderStatus";
import {InvalidArgumentException} from "../common/exceptions";
import {getDeliveryShortType, QrBarImage} from "../common/helper/helpers";
import {isCash, isPaymentMode} from "../common/enum/paymentModes";
import {BatchRequestTypes, BatchRequestTypesStatus} from "../common/enum/batchRequestTypes";
import {ProductService} from "../services/product.service";
import {Product} from "../models/Product";
import {TemplateService} from "../services/template.service";
import {UserService} from "../services/user.service";
import {BatchRequestService} from "../services/batchRequest.service";
import {UserShortDTO} from "./parsers/user";

@route('/category')
export class CategoryController extends BaseController<Category> {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly productService: ProductService,
        private readonly templateService: TemplateService,
        private readonly userService: UserService,
        private readonly batchRequestService: BatchRequestService
    ){
        super(categoryService);
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
        return [];
    }

    getEntityTarget(): EntityTarget<Category> {
        return Category;
    }

    getInstance(): Object {
        return new Category();
    }

    getParseGET(entity: Category): Object {
        return entity;
    }

    getParsePOST(entity: Category): Object {
        return entity;
    }

    getParsePUT(entity: Category): Object {
        return entity;
    }

    /** Servicios */

    /**
     * Obtener plantilla de impresión
     * @param req
     * @param res
     */
    @route('/batch/printRequest')
    @GET()
    public async printRequest(req: Request, res: Response) {
        try {
            const limitForQueries = 5000; //Limite para una petición

            const query = req.query;
            const conditional = query.conditional ? query.conditional + "" : null;

            const queryCondition = ConditionalQuery.ConvertIntoConditionalParams(conditional);

            /** Hacer aqui un arreglo para que obtenga por ids y mande los IDS */
            const operationQuery = new OperationQuery(null, null);
            let page = new PageQuery(limitForQueries,0,queryCondition, operationQuery);

            page.setRelations(['productSize', 'category']);

            let products: Array<Product> = await this.productService.all(page);

            if(products.length > 0){

                let batchHtml : any = [];

                const productsGroups : any = [];

                let groupIndex = 1;

                 products.map((item, index) => {
                    if(index % 4){
                        groupIndex++;
                    }
                    if(!productsGroups[groupIndex]){
                        productsGroups[groupIndex] = [];
                    }

                    productsGroups[groupIndex].push({
                            product: item,
                            category: item.category,
                            productSize: item.productSize,
                            hasStarts: (item.price <= 800) && (item.category && item.category.id == 1),
                            isTop: ((index % 4) >= 2),
                            classTop: ((index % 4) >= 2) ? "top" : "bottom",
                            price: item.price,
                            sizes: []
                        }
                    );
                });

                let increment = 1;
                const result = productsGroups.map(async products => {
                    const templateName = this.categoryService.getCatalogTemplate();
                    const object = {
                        products
                    };
                    const template = await this.templateService.getTemplate(templateName, object);
                    if(!template){
                        throw new InvalidArgumentException("No se ha encontrado una plantilla asociada");
                    }

                    return batchHtml.push({groupProducts: increment++, html: template});
                });

                await Promise.all(result);

                const user = await this.userService.find(req["user"]);

                /** TODO -- cambiar valor body a LONGTEXT */

                const save = await this.batchRequestService.createOrUpdate({
                    body: batchHtml,
                    type: BatchRequestTypes.CATALOGS,
                    status: BatchRequestTypesStatus.COMPLETED,
                    user: UserShortDTO(user)
                });

                return res.json({status: 200, batch: {...save}});

            } else {
                return res.json({status: 400, error: "No se han encontrado registros"});
            }
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }



    getGroupRelations(): Array<string> {
        return [];
    }

}
