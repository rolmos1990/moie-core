import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {ProductSize} from "../models/ProductSize";
import {ProductSizeOriginal} from "../models_moie/ProductSize";
import {serverConfig} from "../config/ServerConfig";
import {
    MySQLMoiePersistenceConnection,
    MySQLPersistenceConnection
} from "../common/persistence";

export class ProductSizeService extends BaseService<ProductSize> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(ProductSize, MySQLPersistenceConnection.name);
        this.originalRepository = getRepository(ProductSizeOriginal, MySQLMoiePersistenceConnection.name);
        console.log("asd");
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .orderBy("p.id", "DESC")
            .leftJoinAndSelect("p.product", "pr")
            .leftJoinAndSelect("pr.productNew", "productNew")
            .skip(skip)
            .take(limit);

        const items : ProductSizeOriginal[] = await query.getMany();

        const itemSaved: ProductSize[] = [];

        await items.forEach(item => {
            const _item = new ProductSize();
            _item.id = item.id;
            _item.quantity = item.quantity;
            _item.name = item.name;
            _item.color = item.color;
            _item.product = item.product.productNew;
            itemSaved.push(_item);
        });

        const saved = await this.newRepository.save(itemSaved, { chunk: limit });
        this.printResult(saved, items);
    }

    /**
     * En caso de Falla bajar la migración realizada (Borra todo el progreso generado en esta tabla)
     */
    async down(){
        try {
            await this.newRepository.query(`DELETE FROM ProductSize`);
            await this.newRepository.query(`ALTER TABLE Size AUTO_INCREMENT = 1`);

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
        return ProductSizeService.name
    }

    async onFinish(): Promise<any> {}
}
