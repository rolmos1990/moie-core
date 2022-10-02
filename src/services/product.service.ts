import {BaseService} from "../common/controllers/base.service";
import {Product} from "../models/Product";
import {ProductWeb} from "../models_web/ProductWeb";
import {ProductOriginal} from "../models_moie/Product";
import {getRepository} from "typeorm";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoieStorePersistenceConnection, MySQLPersistenceConnection} from "../common/persistence";

export class ProductService extends BaseService<Product> {

    private readonly newRepository;
    private readonly storeRepository;
    private readonly originalRepository;

    constructor(){
        super();
        this.newRepository = getRepository(Product, MySQLPersistenceConnection.name);
        this.originalRepository = getRepository(ProductOriginal, MySQLMoieStorePersistenceConnection.name);
        this.storeRepository = getRepository(ProductWeb, MySQLMoieStorePersistenceConnection.name);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.productWeb", "productWeb")
            .leftJoinAndSelect("p.size", "size")
            .leftJoinAndSelect("productWeb.category", "cat")
            .orderBy("p.id", "DESC")
            .skip(skip)
            .take(limit);

        const items : ProductOriginal[] = await query.getMany();

        const products: Product[] = [];

        await items.forEach(item => {
            const product = new Product();
            product.name = item.name;
            product.provider = item.provider;
            product.cost = item.cost;
            product.price = item.price;
            if(item.size) {
                product.size = item.size.id;
            }
            product.createdAt = item.createdAt;
            product.updatedAt = item.createdAt;
            product.material = item.material;
            product.weight = item.weight;
            product.reference = item.id;
            product.tags = item.tags;
            product.imagesQuantity = 0;
            product.published = false;
            product.tags = item.tags;
            product.sizeDescription = item.tags;

            //A,B,C..etc..
            const referenceKey = item.id.slice(0, 2).replace(/[0-9]/g, '');
            product.referenceKey = referenceKey;

            if(item.productWeb) {
                const productWeb = item.productWeb;
                /**
                 * Si contiene producto web (Descarga la información del producto web)
                 */
                product.discount = productWeb.discount;
                product.description = productWeb.description;
                product.imagesQuantity = productWeb.imagenes;
                product.orden = productWeb.orden;
                product.published = true;

                if(productWeb.category){
                    product.category = productWeb.category.id;
                }

            }

            product.status = true;
            products.push(product);

        });
        const saved = await this.newRepository.save(products, { chunk: limit });
        this.printResult(saved, items);
    }

    /**
     * En caso de Falla bajar la migración realizada (Borra todo el progreso generado en esta tabla)
     */
    async down(){
        try {
            await this.newRepository.query(`DELETE FROM Product`);
            await this.newRepository.query(`ALTER TABLE Product AUTO_INCREMENT = 1`);

        }catch(e){
            this.printError();
        }
    }

    /**
     * Cantidad previa para evaluar si finalizo con exito
     */
    async counts(){
        const {count} = await this.originalRepository.createQueryBuilder("p")
            .select("COUNT(p.id)", "count").getRawOne();

        if(serverConfig.isFakeCounters){
            if(count < serverConfig.fakeCounterLimit){
                return count;
            }
            return serverConfig.fakeCounterLimit;
        }

        return count;
    }

    /**
     * Cantidad nueva para verificar si coincide con la migración
     */
    async countsNew(){
        const {count} = await this.newRepository.createQueryBuilder("p")
            .select("COUNT(p.id)", "count").getRawOne();
        return count;
    }

    processName() {
        return ProductService.name
    }

    onFinish() {
    }
}
