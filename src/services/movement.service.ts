import {BaseService} from "../common/controllers/base.service";
import {Movement} from "../models/Movement";
import {MovementRepository} from "../repositories/movement.repository";
import moment = require("moment");

export class MovementService extends BaseService<Movement> {
    constructor(
        private readonly movementRepository: MovementRepository<Movement>
    ){
        super(movementRepository);
    }

    async getReport(){
        const movements = await this.movementRepository.createQueryBuilder('q').getMany();

        const billetera = {
            "saldo": 0,
            "inicioMes": 0,
            "fechaUltimoMovimiento": ""
        };

        const today = moment();
        const lastSat = today.isoWeekday(-1);
        const fecha_inicio_mes = lastSat.startOf('day')

        //const fecha_inicio_mes = strtotime("last saturday 00:00:00");

        movements.map(item => {

            billetera.saldo += item.amount;
            billetera.fechaUltimoMovimiento = item.date ? moment(item.date).format('DD/MM/YYYY') : "";

            if(moment(item.date).isBefore(fecha_inicio_mes)){
                billetera.inicioMes = item.amount;
            }

        });

        return billetera;


    }
}
