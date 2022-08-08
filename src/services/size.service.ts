import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {SizeOriginal} from "../models_moie/Size";
import {Size} from "../models/Size";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoiePersistenceConnection} from "../common/persistence";

export class SizeService extends BaseService<SizeService> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Size);
        this.originalRepository = getRepository(SizeOriginal, MySQLMoiePersistenceConnection.name);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .orderBy("p.id", "DESC")
            .skip(skip)
            .take(limit);

        const items : SizeOriginal[] = await query.getMany();

        const itemSaved: Size[] = [];

        await items.forEach(item => {
            const _item = new Size();
            _item.id = item.id;
            _item.name = item.name;
            _item.sizes = JSON.parse(item.sizes);
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
            await this.newRepository.query(`DELETE FROM Size`);
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
        return SizeService.name
    }

    async onFinish(): Promise<any> {}
}
