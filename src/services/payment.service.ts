import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {Payment as PaymentOriginal} from "../models_moie/Payment";
import {Payment} from "../models/Payment";
import {serverConfig} from "../config/ServerConfig";
import {Order as OrderNew} from "../models/Order";
import {MySQLMoiePersistenceConnection, MySQLPersistenceConnection} from "../common/persistence";

export class PaymentService extends BaseService<Payment> {

    private readonly newRepository;
    private readonly originalRepository;
    private readonly orderRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Payment, MySQLPersistenceConnection.name);
        this.originalRepository = getRepository(PaymentOriginal, MySQLMoiePersistenceConnection.name);
        this.orderRepository = getRepository(OrderNew, MySQLPersistenceConnection.name);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){
        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("u")
            .leftJoinAndSelect("u.order", "o")
            .leftJoinAndSelect("o.orderNew", "on")
            .orderBy("u.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : PaymentOriginal[] = await query.getMany();

        const itemSaved: Payment[] = [];

        const orderUpdated : OrderNew[] = [];

        const d = new Date();
        d.setDate(d.getFullYear() - 7); // 7 Years ago

        await items.forEach(item => {
            const _item = new Payment();
            _item.id = item.id;
            _item.name = item.name || 'Sin Nombre';
            _item.createdAt = item.createdAt;
            _item.status = item.order ? 1 : 0;
            _item.originBank = item.origen;
            _item.targetBank = item.bank;
            _item.consignmentAmount = parseFloat(item.amount) || 0;
            _item.consignmentNumber = item.reference;
            _item.email = item.email;
            _item.type = item.type;
            _item.user = 1;
            _item.status = 0;

            if(isNaN(item.createdAt.getTime())){
                _item.createdAt = new Date();
            }

            if(_item.order === null){
                //CANCELLED
                _item.status = 2;
            } else if(_item.order && _item.order.id === 0){
                //PENDING ORDER
                _item.status = 0;
            } else {
                //CONCILIED
                _item.status = 1;
            }

            if(item.order && item.order.orderNew){
                item.order.orderNew.payment = item.id;
                orderUpdated.push(item.order.orderNew);
            }

            itemSaved.push(_item);
        });

        const saved = await this.newRepository.save(itemSaved, { chunk: limit });
        await this.orderRepository.save(orderUpdated, {chunk: limit});

        this.printResult(saved, items);
    }

    /**
     * En caso de Falla bajar la migración realizada (Borra todo el progreso generado en esta tabla)
     */
    async down(){
        try {

            //const conn = await getConnection(MySQLMoiePersistenceConnection.name);
            //await conn.query("UPDATE `moie-lucy`.pago SET id_venta = null where id_venta = -1");
            await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");
            await this.newRepository.query(`DELETE FROM Payment`);
            await this.newRepository.query(`ALTER TABLE Payment AUTO_INCREMENT = 1`);

        }catch(e){
            console.log("se produjo un error raro : ", e.message);
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

    async onFinish(): Promise<any> {}
}
