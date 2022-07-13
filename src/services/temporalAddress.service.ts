import {BaseService} from "../common/controllers/base.service";
import {Category} from "../models/Category";
import {getRepository} from "typeorm";
import {Customer as ClientOriginal} from "../models_moie/Client";
import {Customer} from "../models/Client";
import {TemporalAddress} from "../models/TemporalAddress";

export class TemporalAddressService extends BaseService<Category> {

    private readonly newRepository;
    private readonly originalRepository;
    private readonly newAddressRepository;

    constructor(){
        super();
        this.newRepository = getRepository(Customer);
        this.originalRepository = getRepository(ClientOriginal);
        this.newAddressRepository = getRepository(TemporalAddress);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.municipality", "municipality")
            .leftJoinAndSelect("p.clientNew", "clientNew")
            .where("p.municipality IS NULL OR p.municipality = 0")
            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : ClientOriginal[] = await query.getMany();

        const itemSaved: TemporalAddress[] = [];

        await items.forEach(item => {
                const _item = new TemporalAddress();
                _item.state = item.state;
                _item.municipality = item.city;
                _item.client = item.clientNew;
                itemSaved.push(_item);
        });
        const saved = await this.newAddressRepository.save(itemSaved, { chunk: limit });
        this.printResult(saved, items);
    }

    /**
     * En caso de Falla bajar la migración realizada (Borra todo el progreso generado en esta tabla)
     */
    async down(){
        try {
            await this.newAddressRepository.query(`DELETE FROM TemporalAddress`);
            await this.newAddressRepository.query(`ALTER TABLE TemporalAddress AUTO_INCREMENT = 1`);

        }catch(e){
            this.printError();
        }
    }

    /**
     * Cantidad previa para evaluar si finalizo con exito
     */
    async counts(){
        const {count} = await this.originalRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.municipality", "municipality")
            .where("p.municipality IS NULL OR p.municipality = 0")
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
        return TemporalAddressService.name
    }
}
