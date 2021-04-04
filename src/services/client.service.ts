import {BaseService} from "../common/controllers/base.service";
import {Category} from "../models/Category";
import {getRepository} from "typeorm";
import {Client as ClientOriginal} from "../models_moie/Client";
import {Client} from "../models/Client";

export class ClientService extends BaseService<Category> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Client);
        this.originalRepository = getRepository(ClientOriginal);
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

        const items : ClientOriginal[] = await query.getMany();

        const itemSaved: Client[] = [];

        await items.forEach(item => {
            const _item = new Client();
            _item.id = item.id;
            _item.name = item.name;
            _item.isMayorist = false;
            _item.email = item.email;
            _item.cellphone = item.cellphone;
            _item.phone = item.phone;
            _item.hasNotification = true;
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
            await this.newRepository.query(`DELETE FROM Client`);
            await this.newRepository.query(`ALTER TABLE Client AUTO_INCREMENT = 1`);

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
        return ClientService.name
    }
}
