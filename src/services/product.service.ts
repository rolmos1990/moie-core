import {BaseService} from "../common/controllers/base.service";
import {Product} from "../models/Product";
import {Product as ProductWeb} from "../models_web/Product";
import {Product as ProductOriginal} from "../models_moie/Product";
import {getRepository} from "typeorm";

interface ProductWebI {
    codigo: string,
    descripcion: string,
    imagenes: number,
    discount: number,
    createdAt: Date
};

interface ProductMixedI {
    id: string,
    name: string,
    brand: string,
    material: string,
    provider: string,
    price: number,
    cost: number,
    weight: number,
    tags: string,
    createdAt: Date,
    productWeb: ProductWebI
}

export class ProductService extends BaseService<Product> {

    private readonly newRepository;
    private readonly storeRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Product);
        this.storeRepository = getRepository(ProductWeb);
        this.originalRepository = getRepository(ProductOriginal);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        //TODO -- agregar aqui las categorias..

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.productWeb", "productWeb")
            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : ProductMixedI[] = await query.getMany();

        const products: Product[] = [];

        await items.forEach(item => {
            const product = new Product();
            product.name = item.name;
            product.provider = item.brand;
            product.cost = item.cost;
            product.price = item.price;
            product.createdAt = item.createdAt;
            product.updatedAt = item.createdAt;
            product.material = item.material;
            product.weight = item.weight;
            product.reference = item.id;
            product.tags = item.tags;

            if(item.productWeb) {
                /**
                 * Si contiene producto web (Descarga la información del producto web)
                 */
                product.discount = item.productWeb.discount;
                product.description = item.productWeb.descripcion;
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
}
