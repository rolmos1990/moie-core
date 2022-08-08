import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {BillCreditMemo as BillCreditMemoOriginal} from "../models_moie/BillCreditMemo";
import {BillCreditMemo} from "../models/BillCreditMemo";
import {converters} from "../common/helper/converters";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoiePersistenceConnection, MySQLPersistenceConnection} from "../common/persistence";
import {OrderHistoric} from "../models/OrderHistoric";

export class BillCreditMemoService extends BaseService<BillCreditMemo> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(BillCreditMemo, MySQLPersistenceConnection.name);
        this.originalRepository = getRepository(BillCreditMemoOriginal, MySQLMoiePersistenceConnection.name);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.bill", "b")
            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : BillCreditMemoOriginal[] = await query.getMany();

        const itemSaved: BillCreditMemo[] = [];

        await items.forEach(item => {
            const _item = new BillCreditMemo();
            _item.id = item.id;
            _item.bill = item.bill ? item.bill.id : null;
            _item.status = converters._creditMemoStatus(item);
            _item.createdAt = item.createdAt;
            _item.memoType = 'CreditNoteType';

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
            await this.newRepository.query(`DELETE FROM BillCreditMemo`);
            await this.newRepository.query(`ALTER TABLE BillCreditMemo AUTO_INCREMENT = 1`);

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
        return BillCreditMemoService.name
    }

    async onFinish(): Promise<any> {}
}
