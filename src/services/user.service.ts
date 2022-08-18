import {BaseService} from "../common/controllers/base.service";
import {getRepository} from "typeorm";
import {User as UserOriginal} from "../models_moie/User";
import {User} from "../models/User";
import {getPasswordAndSalt} from "../common/helper/helpers";
import {serverConfig} from "../config/ServerConfig";
import {MySQLMoiePersistenceConnection} from "../common/persistence";

export class UserService extends BaseService<User> {

    private readonly newRepository;
    private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(User);
        this.originalRepository = getRepository(UserOriginal, MySQLMoiePersistenceConnection.name);
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

        const items : UserOriginal[] = await query.getMany();

        const itemSaved: User[] = [];

        const _password = await getPasswordAndSalt("Moie123.");

        await items.forEach(item => {

            const _item = new User();
            _item.id = item.idNumeric;
            _item.username = item.id;
            _item.password = _password.password;
            _item.salt = _password.salt;
            _item.email = item.id + "@gmail.com";
            _item.name = item.name;
            _item.lastname = ' ';
            _item.createdAt = new Date();
            _item.securityRol = 2;
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
            await this.newRepository.query(`DELETE FROM User`);
            await this.newRepository.query(`ALTER TABLE User AUTO_INCREMENT = 1`);

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
        return UserService.name
    }

    async onFinish(): Promise<any> {}
}
