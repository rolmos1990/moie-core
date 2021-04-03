import {PageQuery} from "./page.query";
import {IService} from "../interfaces/IService";
import {classToClass} from "class-transformer";

export abstract class BaseService<Entity> implements IService {
    abstract async up(limit, skip);
    abstract async down();
    abstract async counts();
    abstract async countsNew();
    abstract async processName();

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
