import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {CommentCustomer as CommentOriginal} from "../models_moie/CommentCustomer";
import {Comment} from "../models/Comments";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoiePersistenceConnection} from "../common/persistence";

export class CommentCustomerService extends BaseService<Comment> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Comment);
        this.originalRepository = getRepository(CommentOriginal, MySQLMoiePersistenceConnection.name);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.user", "u")
            .leftJoinAndSelect("p.customer", "c")
            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : CommentOriginal[] = await query.getMany();

        const itemSaved: Comment[] = [];

        await items.forEach(item => {

            const _item = new Comment();
            _item.id = item.id;
            _item.comment = item.message;
            _item.createdAt = item.createdAt;
            _item.user = item.user ? item.user.idNumeric : 1;
            _item.entity = 'customer';
            _item.idRelated = item.customer ? item.customer.id.toString() : "1";

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
            await this.newRepository.query(`DELETE FROM Comment`);
            await this.newRepository.query(`ALTER TABLE Comment AUTO_INCREMENT = 1`);

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
        return CommentCustomerService.name
    }
}
