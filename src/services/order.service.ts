import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {Order as OrderOriginal} from "../models_moie/Order";
import {Order} from "../models/Order";
import {converters} from "../common/helper/converters";
import {OrderDelivery} from "../models/OrderDelivery";
import {serverConfig} from "../config/ServerConfig";
import {getCalculateCosts} from "../common/helper/helpers";

export class OrderService extends BaseService<Order> {

    private readonly newRepository;
    private readonly originalRepository;
    private readonly orderDeliveryRepository;

    constructor(){
        super();
        this.newRepository = getRepository(Order);
        this.originalRepository = getRepository(OrderOriginal);
        this.orderDeliveryRepository = getRepository(OrderDelivery);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("o")
            .leftJoinAndSelect("o.office", "f")
            .leftJoinAndSelect("o.postSale", "ps")
            .leftJoinAndSelect("o.user", "u")
            .leftJoinAndSelect("o.customer", "c")
            .leftJoinAndSelect("c.municipality", "m")
            .leftJoinAndSelect("o.orderDetail", "od")
            .leftJoinAndSelect("od.product", "p")
            .orderBy("o.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : OrderOriginal[] = await query.getMany();

        const itemSaved: Order[] = [];
        const itemDeliverySaved: OrderDelivery[] = [];

        await items.forEach(item => {
            try {
                const _item = new Order();
                _item.id = item.id;
                _item.dateOfSale = item.dateOfSale;
                _item.piecesForChanges = item.piecesForChanges;
                _item.prints = item.prints;
                _item.photos = 0;
                _item.expiredDate = item.expiredDate;
                _item.origen = item.origen;
                _item.customer = item.customer ? item.customer.id : null;


                //Converters
                _item.status = converters._statusConverter(item);
                _item.deliveryMethod = converters._deliveryMethodConverter(item);

                //Calculate costs
                if(item.orderDetail) {

                    const costs = getCalculateCosts(item.orderDetail);
                    //Calculate amount
                    _item.totalAmount = (costs.totalAmount - costs.totalDiscount) + item.deliveryAmount;
                    _item.subTotalAmount = costs.totalAmount;
                    _item.totalWithDiscount = (costs.totalAmount - costs.totalDiscount);
                    _item.totalDiscount = costs.totalDiscount;
                    _item.totalWeight = costs.totalWeight;
                    _item.totalRevenue = costs.totalRevenue;
                    _item.quantity = item.orderDetail.reduce((s, p) => parseInt(p.quantity.toString()) + parseInt(s.toString()), 0);
                }


                _item.remember = item.remember;
                _item.paymentMode = converters._paymentModeConverter_single(item.paymentMode); //item.paymentMode;
                _item.createdAt = item.createdAt;
                _item.updatedAt = item.dateOfSale || item.createdAt;
                _item.modifiedDate = item.dateOfSale || item.createdAt;


                //relations (internal)
                _item.orderDelivery = converters._orderDeliveryConverter(item);

                _item.user = item.user ? item.user.idNumeric : null;
                _item.office = item.office ? item.office.id : null;

                itemDeliverySaved.push(_item.orderDelivery);
                itemSaved.push(_item);
            }catch(e){
                console.log("error en pedido", e.message);
            }
            //itemDeliverySaved.push(_item.orderDelivery);
        });

        const saved = await this.newRepository.save(itemSaved, { chunk: limit });
        await this.orderDeliveryRepository.save(itemDeliverySaved, {chunk: limit});

        this.printResult(saved, items);
    }

    /**
     * En caso de Falla bajar la migración realizada (Borra todo el progreso generado en esta tabla)
     */
    async down(){
        try {
            await this.newRepository.query('DELETE FROM `Order`');
            await this.newRepository.query('ALTER TABLE `Order` AUTO_INCREMENT = 1');

        }catch(e){
            console.log(e.message);
            this.printError();
        }
    }

    /**
     * Cantidad previa para evaluar si finalizo con exito
     */
    async counts(){
        const {count} = await this.originalRepository.createQueryBuilder("o")
            .select("COUNT(o.id)", "count").getRawOne();

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
        const {count} = await this.newRepository.createQueryBuilder("o")
            .select("COUNT(o.id)", "count").getRawOne();
        return count;
    }

    processName() {
        return OrderService.name
    }
}
