import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {BillConfig as BillConfigOriginal} from "../models_moie/BillConfig";
import {BillConfig} from "../models/BillConfig";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoiePersistenceConnection} from "../common/persistence";

export class BillConfigService extends BaseService<BillConfig> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(BillConfig);
        this.originalRepository = getRepository(BillConfigOriginal, MySQLMoiePersistenceConnection.name);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : BillConfigOriginal[] = await query.getMany();

        const itemSaved: BillConfig[] = [];

        await items.forEach(item => {
            const _item = new BillConfig();
            _item.id = item.id;
            _item.startNumber = item.startNumber;
            _item.resolutionDate = item.resolutionDate;
            _item.finalNumber = item.finalNumber;
            _item.number = item.number;
            _item.prefix = item.prefix;
            _item.createdAt = new Date();
            _item.status = item.status;

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
            await this.newRepository.query(`DELETE FROM BillConfig`);
            await this.newRepository.query(`ALTER TABLE BillConfig AUTO_INCREMENT = 1`);

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
        return BillConfigService.name
    }
}
