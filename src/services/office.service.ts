import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {Office as OfficeOriginal} from "../models_moie/Office";
import {Office} from "../models/Office";
import {converters} from "../common/helper/converters";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoiePersistenceConnection} from "../common/persistence";

export class OfficeService extends BaseService<Office> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Office);
        this.originalRepository = getRepository(OfficeOriginal, MySQLMoiePersistenceConnection.name);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("u")
            .orderBy("u.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : OfficeOriginal[] = await query.getMany();

        const itemSaved: Office[] = [];

        await items.forEach(item => {
            const _item = new Office();
            _item.id = item.id;
            _item.batchDate = item.createdAt;
            _item.description = item.description;
            _item.name = item.description;

            //converters
            _item.type = converters._deliveryTypeConverter(item.type);
            _item.deliveryMethod = converters._deliveryMethodConverter_single(item.method);
            _item.status = converters._officeStatusConverter_single(item.status);

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
            await this.newRepository.query(`DELETE FROM Office`);
            await this.newRepository.query(`ALTER TABLE Office AUTO_INCREMENT = 1`);

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
        return OfficeService.name
    }

    onFinish() {
    }
}
