import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {Movement as MovementOriginal} from "../models_moie/Movement";
import {Movement} from "../models/Movement";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoiePersistenceConnection, MySQLPersistenceConnection} from "../common/persistence";

export class MovementService extends BaseService<Movement> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Movement, MySQLPersistenceConnection.name);
        this.originalRepository = getRepository(MovementOriginal, MySQLMoiePersistenceConnection.name);
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

        const items : MovementOriginal[] = await query.getMany();

        const itemSaved: Movement[] = [];

        await items.forEach(item => {
            const _item = new Movement();
            _item.id = item.id;
            _item.date = item.date;
            _item.amount = item.amount;
            _item.comment = item.comment;
            _item.description = item.description;

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
            await this.newRepository.query(`DELETE FROM Movement`);
            await this.newRepository.query(`ALTER TABLE Movement AUTO_INCREMENT = 1`);

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
        return MovementService.name
    }
}
