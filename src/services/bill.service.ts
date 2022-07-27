import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {Bill as BillOriginal} from "../models_moie/Bill";
import {Bill} from "../models/Bill";
import {converters} from "../common/helper/converters";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoiePersistenceConnection, MySQLPersistenceConnection} from "../common/persistence";
import {OrderHistoric} from "../models/OrderHistoric";

export class BillService extends BaseService<Bill> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Bill, MySQLPersistenceConnection.name);
        this.originalRepository = getRepository(BillOriginal, MySQLMoiePersistenceConnection.name);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.order", "o")
            .leftJoinAndSelect("p.billConfig", "bc")
            .leftJoinAndSelect("o.orderNew", "on")
            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : BillOriginal[] = await query.getMany();

        const itemSaved: Bill[] = [];

        await items.forEach(item => {
            const _item = new Bill();
            _item.id = item.id;
            _item.dianCreditMemoLog = null;
            _item.order = item.order ? item.order.id : null;
            _item.billConfig = item.billConfig ? item.billConfig.id : null;
            _item.dianLog = null;
            _item.status = converters._billStatus(item);
            _item.tax = item.tax;
            _item.legalNumber = item.legalNumber;
            _item.createdAt = item.createdAt;

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
            await this.newRepository.query(`DELETE FROM Bill`);
            await this.newRepository.query(`ALTER TABLE Bill AUTO_INCREMENT = 1`);

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
        return BillService.name
    }
}
