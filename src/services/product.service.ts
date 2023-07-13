import {BaseService} from "../common/controllers/base.service";
import {ProductRepository} from "../repositories/product.repository";
import {Product} from "../models/Product";
import {InvalidArgumentException} from "../common/exceptions";
import {ProductAvailableViewRepository} from "../repositories/productAvailableView.repository";
import {ProductAvailable} from "../models/ProductAvailable";
import {Category} from "../models/Category";
import {CONFIG_MEDIA} from "./mediaManagement.service";
import {formatPriceWithoutDecimals, getRandomArbitrary} from "../common/helper/helpers";
import {TemplateService} from "./template.service";
import {getRepository, Repository} from "typeorm";

export class ProductService extends BaseService<Product> {

    protected readonly repositoryManager : Repository<Product>;

    constructor(
        private readonly productRepository: ProductRepository<Product>,
        private readonly productAvailableViewRepository: ProductAvailableViewRepository<ProductAvailable>,
        private readonly templateService: TemplateService,
    ){
        super(productRepository);
        this.repositoryManager = getRepository(Product);
    }

    public async getReference(referenceKey: string){
        try {
            return this.productRepository.getNextReferenceCode(referenceKey);
        }catch(e){
            throw new InvalidArgumentException();
        }
    }

    public async getNextOrder(category: Category) : Promise<number>{
        try {
            return await this.productRepository.getNextOrderFromCategory(category);
        }catch(e){
            throw new InvalidArgumentException();
        }
    }

    public async getAffectedByOrden(orden, category) : Promise<Product[]>{
        try {
            return await this.productRepository.getAffectedByOrden(orden, category);
        }catch(e){
            throw new InvalidArgumentException();
        }
    }

    public async getDashboardStat(){
        const products = await this.productAvailableViewRepository.createQueryBuilder('pav')
            .select('COUNT(id) as qty, SUM(available) as available, SUM(reserved) as reserved, SUM(completed) as completed')
            .getRawOne();

        return {
            qty: products['qty'],
            available: products['available'],
            reserved: products['reserved'],
            completed: products['completed']};
    }

    public async createCatalogForProduct(productId:any, defaultTemplate = -1){

        const product = await this.find(productId, ['category', 'productImage', 'productSize']);
        const images = product.productImage;
        const hasDefault = (images && images.length > 0 && defaultTemplate != -1);
        if(images && images.length > 0 && product.template || hasDefault) {

            const imagesArray = images.map(item => {
                 const imageJson = JSON.parse(item.thumbs);

                    const big = item.path;
                    const high =  imageJson.high;
                    const medium = imageJson.medium;

                return {big, high, medium};
            });

            const templateCatalogId = (hasDefault) ? defaultTemplate : product.template;

            let discount = 0;
            if (product.discount > 0) {
                discount = (product.price * product.discount) / 100;
            } else if (product.category && product.category.discountPercent > 0) {
                discount = (product.price * product.category.discountPercent) / 100;
            }

            const priceWithDiscount = product.price - discount;

            //sizes
            const sizes = [];
            product.productSize = product.productSize && product.productSize.length > 0 ? product.productSize.map(_sizeItem => {
                if (_sizeItem.name.toUpperCase() == "UNICA" && product.sizeDescription) {
                    if (product.sizeDescription) {
                        sizes.push(_sizeItem.name.toUpperCase() + ': ');
                        sizes.push(product.sizeDescription);
                    } else {
                            sizes.push(_sizeItem.name.toUpperCase());
                    }
                } else {
                    if(_sizeItem.quantity > 0) {
                        sizes.push(_sizeItem.name.toUpperCase());
                    }
                }
                return _sizeItem;
            }) : [];

            const renderImage = (item, index, dimension) => {
                if(item) {
                    if (item && item[index] && item[index][dimension]) {
                        return CONFIG_MEDIA.LOCAL_PATH + '/' + item[index][dimension];
                    } else if (item && item[index - 2] && item[index - 2][dimension]) {
                        return CONFIG_MEDIA.LOCAL_PATH + '/' + item[index - 2][dimension];
                    } else if (item && item[index - 1] && item[index - 1][dimension]) {
                        return CONFIG_MEDIA.LOCAL_PATH + '/' + item[index - 1][dimension];
                    } else {
                        return ''; //not image preset
                    }
                } else {
                    return '';
                }
            }

            const catalogInfo = {
                category: product.category ? product.category.name : '',
                price: '$' + formatPriceWithoutDecimals(Math.ceil(priceWithDiscount)),
                reference: product.reference,
                oldprice: '$' + formatPriceWithoutDecimals(Math.ceil(product.price)),
                material: product.material,
                size: sizes.join(' '),
                description: product.description,

                image1_big: renderImage(imagesArray,0 ,'big'),
                image2_big: renderImage(imagesArray,1 ,'big'),
                image3_big: renderImage(imagesArray,2 ,'big'),

                image1_high: renderImage(imagesArray,0 ,'high'),
                image2_high: renderImage(imagesArray,1 ,'high'),
                image3_high: renderImage(imagesArray,2 ,'high'),

                image1_medium: renderImage(imagesArray,0 ,'medium'),
                image2_medium: renderImage(imagesArray,1 ,'medium'),
                image3_medium: renderImage(imagesArray,2 ,'medium'),

                text: "Hay " + parseInt(getRandomArbitrary(5,20)) + " personas viendo este producto",
                text2: "Se ha vendido " + parseInt(getRandomArbitrary(5,20)) + " veces en las últimas 24 horas",
                text3: "Este producto está muy solicitado",
                host: 'http://moie.lucymodas.com:18210'
            };

            console.log('catalogInfo: ', catalogInfo);

            const html = await this.templateService.getTemplateCatalogHtml(templateCatalogId, catalogInfo);
            const fullPath = await this.templateService.generateCatalog(html, product.reference);

            const productSaved = await this.find(productId);
            productSaved.catalogUrl = fullPath;
            await this.productRepository.save(productSaved);
            return fullPath;
        } else {
            return false;
        }

    }

    async getProductWithSizes(){
        return await this.repositoryManager.manager.query(
            'SELECT product.id AS id from productsize inner join product on productsize.product_id = product.id where productsize.quantity > 0 group by productsize.product_id'
        );
    }

    async getProductAvailablesAndAmount(){
        return await this.repositoryManager.manager.query(
            'SELECT SUM(price) as price, SUM(available) as qty FROM `moie-lucy-v2`.productsbyreference where available > 0'
        );
    }
}

