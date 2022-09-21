import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {Attachment as AttachmentOriginal} from "../models_moie/Attachment";
import {Attachment} from "../models/Attachment";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoiePersistenceConnection, MySQLPersistenceConnection} from "../common/persistence";

export class AttachmentService extends BaseService<Attachment> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Attachment, MySQLPersistenceConnection.name);
        this.originalRepository = getRepository(AttachmentOriginal, MySQLMoiePersistenceConnection.name);
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

        const items : AttachmentOriginal[] = await query.getMany();

        const itemSaved: Attachment[] = [];

        await items.forEach(item => {
            const _item = new Attachment();
            _item.id = item.id;
            _item.movement = item.movement;
            _item.description = item.description;
            _item.type = item.type;

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
            await this.newRepository.query(`DELETE FROM Attachment`);
            await this.newRepository.query(`ALTER TABLE Attachment AUTO_INCREMENT = 1`);

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
        return AttachmentService.name
    }

}
