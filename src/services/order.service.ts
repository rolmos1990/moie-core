import {BaseService} from "../common/controllers/base.service";
import {Category} from "../models/Category";
import {getRepository} from "typeorm";
import {State as StateOriginal} from "../models_moie/State";
import {State} from "../models/State";
import {Order as OrderOriginal} from "../models_moie/Order";
import {Order} from "../models/Order";

export class OrderService extends BaseService<Category> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(State);
        this.originalRepository = getRepository(StateOriginal);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("o")

            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : OrderOriginal[] = await query.getMany();

        const itemSaved: Order[] = [];
        //TODO -- terminar la migracion de ordenes
        await items.forEach(item => {
            const _item = new Order();
            _item.id = item.id;
            _item.dateOfSale = item.dateOfSale;
            _item.piecesForChanges = item.piecesForChanges;
            _item.status = item.status;
            _item.office = item.office;
            _item.deliveryMethod = item.deliveryMethod;
            _item.prints = item.prints;
            _item.photos = 0;
            _item.user = item.user;
            _item.expiredDate = item.expiredDate;
            _item.

            _item.dianCode = item.dianCode;
            _item.isoCode = item.isoCode;
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
            await this.newRepository.query(`DELETE FROM State`);
            await this.newRepository.query(`ALTER TABLE State AUTO_INCREMENT = 1`);

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
        return StateService.name
    }
}
