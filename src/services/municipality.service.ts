import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {Municipality as MunicipalityOriginal} from "../models_moie/Municipality";
import {Municipality} from "../models/Municipality";
import {serverConfig} from "../config/ServerConfig";

export class MunicipalityService extends BaseService<Municipality> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Municipality);
        this.originalRepository = getRepository(MunicipalityOriginal);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.state", "state")
            .leftJoinAndSelect("state.stateNew", "stateNew")
            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : MunicipalityOriginal[] = await query.getMany();

        const itemSaved: Municipality[] = [];

        await items.forEach(item => {
            const _item = new Municipality();
            _item.id = item.id;
            _item.name = item.name;
            _item.dianCode = item.dianCode;
            if(item.state.stateNew){
                _item.state = item.state.stateNew;
            }
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
            await this.newRepository.query(`DELETE FROM Municipality`);
            await this.newRepository.query(`ALTER TABLE Municipality AUTO_INCREMENT = 1`);

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
        return MunicipalityService.name
    }
}
