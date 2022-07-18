import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {Payment as PaymentOriginal} from "../models_moie/Payment";
import {Payment} from "../models/Payment";
import {isNull} from "util";
import {serverConfig} from "../config/ServerConfig";

export class PaymentService extends BaseService<Payment> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Payment);
        this.originalRepository = getRepository(PaymentOriginal);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("u")
            .orderBy("u.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : PaymentOriginal[] = await query.getMany();

        const itemSaved: Payment[] = [];

        await items.forEach(item => {
            const _item = new Payment();
            _item.id = item.id;
            _item.name = item.name || 'Sin Nombre';
            _item.createdAt = item.createdAt ? item.createdAt : new Date()
            _item.status = (item.order != -1) ? 1 : 0;
            _item.originBank = item.origen;
            _item.targetBank = item.bank;
            _item.consignmentAmount = parseFloat(item.amount) || 0;
            _item.consignmentNumber = item.reference;
            _item.email = item.email;
            _item.type = item.type;
            _item.user = 1;

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
            await this.newRepository.query(`DELETE FROM Payment`);
            await this.newRepository.query(`ALTER TABLE Payment AUTO_INCREMENT = 1`);

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
        return PaymentService.name
    }
}
