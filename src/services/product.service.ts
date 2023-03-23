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

export class ProductService extends BaseService<Product> {
    constructor(
        private readonly productRepository: ProductRepository<Product>,
        private readonly productAvailableViewRepository: ProductAvailableViewRepository<ProductAvailable>,
        private readonly templateService: TemplateService
    ){
        super(productRepository);
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

    public async createCatalogForProduct(productId, isHightQuality = true){

        const product = await this.find(productId, ['category', 'productImage', 'productSize']);
        const images = product.productImage;

        if(images && images.length > 0 && product.template) {

            const imagesArray = images.map(item => {
                let regularImage = item.path ? CONFIG_MEDIA.LOCAL_PATH + '/' + item.path : '';
                if (!isHightQuality) {
                    const imageJson = JSON.parse(item.thumbs);
                    regularImage = imageJson.high ? CONFIG_MEDIA.LOCAL_PATH + '/' + item.product : '';
                }
                return regularImage;
            });

            const templateCatalogId = product.template;

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
                    sizes.push(_sizeItem.name.toUpperCase());
                }
                return _sizeItem;
            }) : [];

            const catalogInfo = {
                category: product.category ? product.category.name : '',
                price: '$' + formatPriceWithoutDecimals(Math.ceil(priceWithDiscount)),
                reference: product.reference,
                oldprice: '$' + formatPriceWithoutDecimals(Math.ceil(product.price)),
                material: product.material,
                size: sizes.join(' '),
                image1: imagesArray ? imagesArray[0] : '',
                image2: imagesArray ? imagesArray[1] ? imagesArray[1] : imagesArray[0] : '',
                image3: imagesArray ? imagesArray[3] ? imagesArray[3] : imagesArray[0] : '',
                text: "Hay " + getRandomArbitrary(5,20) + " personas viendo este producto",
                text2: "Se ha vendido " + getRandomArbitrary(5,20) + " veces en las últimas 24 horas",
                text3: "Este producto está muy solicitado",
                host: 'http://localhost:18210'
            };

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
}

