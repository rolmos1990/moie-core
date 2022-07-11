import {GET, PUT, route} from "awilix-express";
import {BaseController} from "../common/controllers/base.controller";
import {Category} from "../models/Category";
import {EntityTarget} from "typeorm";
import {CategoryService} from "../services/category.service";
import {Request, Response} from "express";
import {ConditionalQuery} from "../common/controllers/conditional.query";
import {OperationQuery} from "../common/controllers/operation.query";
import {PageQuery} from "../common/controllers/page.query";
import {InvalidArgumentException} from "../common/exceptions";
import {BatchRequestTypes, BatchRequestTypesStatus} from "../common/enum/batchRequestTypes";
import {ProductService} from "../services/product.service";
import {TemplateService} from "../services/template.service";
import {UserService} from "../services/user.service";
import {BatchRequestService} from "../services/batchRequest.service";
import {UserShortDTO} from "./parsers/user";
import {TemplatesRegisters} from "../common/enum/templatesTypes";
import {CONFIG_MEDIA, MEDIA_FORMAT_OUTPUT, MediaManagementService} from "../services/mediaManagement.service";
import {ProductCatalogViewService} from "../services/productCatalogView.service";
import {CategoryCreateDTO, CategoryUpdateDTO} from "./parsers/category";

@route('/category')
export class CategoryController extends BaseController<Category> {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly productService: ProductService,
        private readonly templateService: TemplateService,
        protected readonly userService: UserService,
        private readonly batchRequestService: BatchRequestService,
        private readonly mediaManagementService: MediaManagementService,
        private readonly productCatalogViewService: ProductCatalogViewService
    ){
        super(categoryService);
    };

    protected afterCreate(item: Object): void {
    }

    protected async afterUpdate(item: Object, req: Request): Promise<void> {
        const {body} = req;
        await this.categoryService.updateImage(item, body.file);
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
        return CategoryCreateDTO(entity);
    }

    getParsePUT(entity: Category): Object {
        return CategoryUpdateDTO(entity);
    }

    /** Test templates */

    /**
     * Obtener plantilla de impresión
     * @param req
     * @param res
     */
    @route('/:id/test/printTestRequest')
    @GET()
    public async printTestRequest(req: Request, res: Response) {
        try {
            const id = req.params.id;

            let products = await this.productCatalogViewService.findByObject({"category": id}, ['productSize', 'category']);

            if(products.length > 0){

                const onlyReference = false;
                const defaultImage = CONFIG_MEDIA.DEFAULT_IMAGE;
                const defaultUrl = CONFIG_MEDIA.LOCAL_PATH;
                const _products = products.map(item => {
                    try {
                            const _image1 = item.firstImage ? defaultUrl + "/" + ((JSON.parse(item.firstImage))['high']) : defaultImage;
                            const _image2 = item.secondImage ? defaultUrl + "/" + ((JSON.parse(item.secondImage))['small']) : defaultImage;
                            item['imagePrimary'] = _image1;
                            item['imageSecondary'] = _image2;
                    }catch(e){
                        item['imagePrimary'] = defaultImage;
                        item['imageSecondary'] = defaultImage;
                    }
                    return item;
                });

                const object = {
                    products: _products,
                    hasPrice : !onlyReference,
                    category: products[0].category
                };

                const template = await this.templateService.getTemplate(TemplatesRegisters.EXPORT_CATALOG_LIST, object);

                return res.send(template);

            } else {
                return res.json({status: 400, error: "No se han encontrado registros"});
            }
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }


    @route('updateImage/:id')
    @PUT()
    public async updateImage(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const body = req.body;
            const category = await this.categoryService.find(parseInt(id));

            if(!category){
                throw new InvalidArgumentException();
            }

            await this.categoryService.updateImage(category, body.file);

            return res.json({status: 200});
        }catch(e){
            this.handleException(e, res);
        }
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

            const onlyReference = queryCondition.hasField('references');
            queryCondition.removeField('references');

            /** Hacer aqui un arreglo para que obtenga por ids y mande los IDS */
            const operationQuery = new OperationQuery(null, null);
            let page = new PageQuery(limitForQueries,0,queryCondition, operationQuery);

            page.setRelations(['productSize', 'category', 'productImage']);

            let products = await this.productCatalogViewService.all(page);
            const defaultImage = CONFIG_MEDIA.DEFAULT_IMAGE;
            const defaultUrl = CONFIG_MEDIA.LOCAL_PATH;

            if(products.length > 0){

                const _products = products.map(item => {
                    try {
                        const _image1 = item.firstImage ? defaultUrl + "/" + ((JSON.parse(item.firstImage))['high']) : defaultImage;
                        const _image2 = item.secondImage ? defaultUrl + "/" + ((JSON.parse(item.secondImage))['small']) : defaultImage;


                        item.productSize = item.productSize.map(_sizeItem => {
                          if(_sizeItem.name.toUpperCase() == "UNICA"){
                              _sizeItem['sizeDesc'] = item.sizeDescription;
                          }
                          return _sizeItem;
                        });

                        item['imagePrimary'] = _image1;
                        item['imageSecondary'] = _image2;

                        return item;
                    }catch(e){
                        item['imagePrimary'] = defaultImage;
                        item['imageSecondary'] = defaultImage;

                        item.productSize = item.productSize.map(_sizeItem => {
                            if(_sizeItem.name.toUpperCase() == "UNICA"){
                                 _sizeItem['sizeDesc'] = item.sizeDescription;
                            }
                            return _sizeItem;
                        });

                        return item;
                    }
                });

                const object = {
                    products: _products,
                    hasPrice : !onlyReference,
                    category: products[0].category
                };

                const template = await this.templateService.getTemplate(TemplatesRegisters.EXPORT_CATALOG_LIST, object);

                if(!template){
                    throw new InvalidArgumentException("No se ha encontrado una plantilla asociada");
                }

                const user = await this.userService.find(req["user"]);

                const response = await this.mediaManagementService.createPDF(template, MEDIA_FORMAT_OUTPUT.b64storage);
                let batch = {
                    body: {url: response.url, name: products[0].category.name },
                    type: !onlyReference ? BatchRequestTypes.CATALOGS : BatchRequestTypes.CATALOGS_REF,
                    status: BatchRequestTypesStatus.COMPLETED,
                    user: UserShortDTO(user)
                };
                await this.batchRequestService.createOrUpdate(batch);
                batch.body = response.data;

                return res.json({status: 200, batch });

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
