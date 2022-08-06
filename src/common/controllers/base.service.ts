import {IService} from "../interfaces/IService";

export abstract class BaseService<Entity> implements IService {
    abstract async up(limit, skip);
    abstract async down();
    abstract async counts();
    abstract async countsNew();
    abstract async processName();
    abstract async onFinish?();

    static getName(){
        return BaseService.name;
    }

    printResult(saved, items){
        console.log("-- cantidad de registros guardados -- ", saved.length);
        console.log("-- se ha guardado con exito : ",  (saved.length === items.length) ? "Si" : "No" );
        console.log("-------------------------------------------");
    }
    printError(){
        console.log("-- Se ha producido un error en : ",  this.processName());
        console.log("-------------------------------------------");
    }
}
