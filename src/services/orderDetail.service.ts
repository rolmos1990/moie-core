import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {OrderDetail as OrderDetailOriginal} from "../models_moie/OrderDetail";
import {OrderDetail} from "../models/OrderDetail";
import {serverConfig} from "../config/ServerConfig";

export class OrderDetailService extends BaseService<OrderDetail> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(OrderDetail);
        this.originalRepository = getRepository(OrderDetailOriginal);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("od")
            .leftJoinAndSelect("od.product", "p")
            .leftJoinAndSelect("p.productSize", "ps")
            .leftJoinAndSelect("p.productNew", "pn")
            .leftJoinAndSelect("pn.size", "siz")
            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : OrderDetailOriginal[] = await query.getMany();

        const itemSaved: OrderDetail[] = [];

        await items.forEach(item => {

            let discountAmount = 0;
            if(item.adjustment > 0) {
                discountAmount = (item.price * item.adjustment / 100);
            }

            const _item = new OrderDetail();
            _item.id = item.id;
            _item.quantity = item.quantity;
            _item.size = item.product && item.product.productNew && item.product.productNew.size? item.product.productNew.size.name : "";
            _item.product = item.product && item.product.productNew ? item.product.productNew.id : null;
            _item.order = item.order ? item.order.id : null;
            _item.cost = item.cost;
            _item.price = item.price;
            _item.discountPercent = item.adjustment;
            _item.revenue = item.price - item.cost - discountAmount;
            _item.weight = item.product ? item.product.weight : null;

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
            await this.newRepository.query(`DELETE FROM OrderDetail`);
            await this.newRepository.query(`ALTER TABLE OrderDetail AUTO_INCREMENT = 1`);

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
        return OrderDetail.name
    }
}
