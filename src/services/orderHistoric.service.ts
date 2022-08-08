import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {OrderHistoric as OrderHistoricOriginal} from "../models_moie/OrderHistoric";
import {OrderHistoric} from "../models/OrderHistoric";
import {converters} from "../common/helper/converters";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoiePersistenceConnection, MySQLPersistenceConnection} from "../common/persistence";
import {OrderDetail} from "../models/OrderDetail";

export class OrderHistoricService extends BaseService<OrderHistoric> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(OrderHistoric, MySQLPersistenceConnection.name);
        this.originalRepository = getRepository(OrderHistoricOriginal, MySQLMoiePersistenceConnection.name);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.user", "s")
            .where("p.entity = :objeto")
            .andWhere("p.status != :accion")
            .andWhere("p.entity * 1 = p.entity")
            .setParameters({objeto: 'venta', accion: 'leer'})
            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : OrderHistoricOriginal[] = await query.getMany();

        const itemSaved: OrderHistoric[] = [];

        await items.forEach(item => {
            const _item = new OrderHistoric();
            //(auto-increase id) _item.id
            _item.id = null;
            _item.user = item.user && item.user.idNumeric ? parseInt(item.user.idNumeric.toString()) || null : null;
            _item.order = item.entityId ? parseInt(item.entityId) : null;
            _item.status = converters._orderHistoricStatus_single(item.status);
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
            await this.newRepository.query(`DELETE FROM OrderHistoric`);
            await this.newRepository.query(`ALTER TABLE OrderHistoric AUTO_INCREMENT = 1`);

        }catch(e){
            this.printError();
        }
    }

    /**
     * Cantidad previa para evaluar si finalizo con exito
     */
    async counts(){
        const {count} = await this.originalRepository.createQueryBuilder("p")
            .select("COUNT(p.id)", "count")
            .where("p.entity = :objeto")
            .andWhere("p.status != :accion")
            .andWhere("p.entity * 1 = p.entity")
            .setParameters({objeto: 'venta', accion: 'leer'})
            .getRawOne();

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
        return OrderHistoricService.name
    }

    async onFinish(): Promise<any> {}
}
