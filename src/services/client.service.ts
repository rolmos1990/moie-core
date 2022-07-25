import {BaseService} from "../common/controllers/base.service";
import {Category} from "../models/Category";
import {getRepository} from "typeorm";
import {Customer as CustomerOriginal} from "../models_moie/Customer";
import {Customer} from "../models/Customer";
import {serverConfig} from "../config/ServerConfig";

export class CustomerService extends BaseService<Category> {

    private readonly newRepository;
    private readonly originalRepository;

    constructor(){
        super();
        this.newRepository = getRepository(Customer);
        this.originalRepository = getRepository(CustomerOriginal);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){

        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");

        const query = this.originalRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.municipality", "municipality")
            .leftJoinAndSelect("municipality.municipalityNew", "municipalityNew")
            .leftJoinAndSelect("municipalityNew.state", "state")
            .orderBy("p.id", "ASC")
            .skip(skip)
            .take(limit);

        const items : CustomerOriginal[] = await query.getMany();

        const itemSaved: Customer[] = [];

        await items.forEach(item => {
            const _item = new Customer();

            _item.id = item.id;
            _item.document = item.ci;
            _item.name = item.name;
            _item.isMayorist = false;
            _item.email = item.email;
            _item.cellphone = item.cellphone;
            _item.phone = item.phone;
            _item.hasNotification = true;
            _item.address = item.city;
            _item.createdAt = item.createdAt;

            if(item.municipality) {
                _item.state = item.municipality.municipalityNew.state;
                _item.municipality = item.municipality.municipalityNew;
            }
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
            await this.newRepository.query(`DELETE FROM Customer`);
            await this.newRepository.query(`ALTER TABLE Customer AUTO_INCREMENT = 1`);

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
        return CustomerService.name
    }
}
