import {BaseService} from "../common/controllers/base.service";
import {Product} from "../models/Product";
import {getRepository} from "typeorm";
import {ProductImage, SIZES} from "../models/ProductImage";
import {serverConfig} from "../config/ServerConfig";

export class ProductImageService extends BaseService<ProductImage> {

    private readonly newRepository;
    private readonly newImagesRepository;

    constructor(){
        super();
        this.newRepository = getRepository(Product);
        this.newImagesRepository = getRepository(ProductImage);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.newRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.category", "category")
            .orderBy("p.id", "DESC")
            .skip(skip)
            .take(limit);

        const items : Product[] = await query.getMany();

        const productImages: ProductImage[] = [];

        await items.forEach(item => {
            if(item.imagesQuantity > 0 && item.category) {
                /**
                 * Se agrega imagenes para cada producto recorrido.
                 */
                for(let imgNumber = 1; imgNumber <= item.imagesQuantity; imgNumber++) {
                    const image = new ProductImage();
                    image.filename = `${item.reference}_${imgNumber}_${SIZES.ORIGINAL}.jpg`;
                    image.group = 1;
                    image.path = `uploads/${item.category.id}/${item.reference}_${imgNumber}_${SIZES.ORIGINAL}.jpg`;
                    image.thumbs = JSON.stringify({
                        "small": `uploads/${item.category.id}/${item.reference}_${imgNumber}_${SIZES.SMALL}.jpg`,
                        "medium": `uploads/${item.category.id}/${item.reference}_${imgNumber}_${SIZES.MEDIUM}.jpg`,
                        "hight": `uploads/${item.category.id}/${item.reference}_${imgNumber}_${SIZES.HIGHT}.jpg`
                    });
                    image.product = item;

                    productImages.push(image);

                }

            }
        });
        const saved = await this.newImagesRepository.save(productImages, { chunk: limit });
        this.printResult(saved, items);
    }

    /**
     * En caso de Falla bajar la migración realizada (Borra todo el progreso generado en esta tabla)
     */
    async down(){
        try {
            await this.newImagesRepository.query(`DELETE FROM ProductImage`);
            await this.newImagesRepository.query(`ALTER TABLE ProductImage AUTO_INCREMENT = 1`);

        }catch(e){
            this.printError();
        }
    }

    /**
     * Cantidad previa para evaluar si finalizo con exito
     */
    async counts(){
        /** El total de imagenes sera la cantidad de imagenes registradas por producto */
        const {sum} = await this.newRepository.createQueryBuilder("p")
            .select("SUM(p.imagesQuantity)", "sum").getRawOne();
        return sum;
    }

    /**
     * Cantidad nueva para verificar si coincide con la migración
     */
    async countsNew(){
        const {count} = await this.newImagesRepository.createQueryBuilder("p")
            .select("COUNT(p.id)", "count").getRawOne();
        return count;
    }

    processName() {
        return ProductImageService.name
    }
}
