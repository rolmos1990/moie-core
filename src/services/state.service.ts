import {BaseService} from "../common/controllers/base.service";
import {Category} from "../models/Category";
import {getRepository} from "typeorm";
import {State as StateOriginal} from "../models_moie/State";
import {State} from "../models/State";
import {serverConfig} from "../config/ServerConfig";

export class StateService extends BaseService<Category> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(State);
        this.originalRepository = getRepository(StateOriginal);
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

        const items : StateOriginal[] = await query.getMany();

        const itemSaved: State[] = [];

        await items.forEach(item => {
            const _item = new State();
            _item.name = item.id;
            _item.dianCode = item.dianCode;
            _item.isoCode = item.isoCode;
            _item.status = true;
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
            await this.newRepository.query(`DELETE FROM State`);
            await this.newRepository.query(`ALTER TABLE State AUTO_INCREMENT = 1`);

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
        return StateService.name
    }
}
