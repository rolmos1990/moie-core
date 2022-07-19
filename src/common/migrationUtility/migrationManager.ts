import {IService} from "../interfaces/IService";
import {BaseService} from "../controllers/base.service";
import {PaymentService} from "../../services/payment.service";
import {OrderService} from "../../services/order.service";
import {serverConfig} from "../../config/ServerConfig";

export class MigrationManager {
    private readonly service : BaseService<any>;
    private limitPerBatch = serverConfig.limitPerBatch;
    constructor(service: BaseService<any>){
        this.service = service;
    }
    async run(monitor = true) {
        let pointer = 0;
        const name = await this.service.processName();
        if(serverConfig.includeServices.length > 0 && !(serverConfig.includeServices.includes(name))){
            return;
        }

        try {

            const size = await this.service.counts();

            console.log("--- Preparando servicio de migración");
            await this.service.down();
            console.log("--- Cantidad de Registros encontrados: (" +  size + ") - " + name);
            console.log("--- Iniciando migración para proceso ## - " + name);

            let totalMigrados;
            if (size < this.limitPerBatch) {
                console.log("--- Iniciando migración desde 1 hasta " + size + " - " + name);
                await this.service.up(this.limitPerBatch, 0);
                totalMigrados = await this.service.countsNew();
                this.printMessage(name,size,totalMigrados, monitor);

            } else {
                for (let i = 0; i < size; i = i + this.limitPerBatch) {
                    pointer = i;
                    console.log("--- Iniciando migración desde " + (i + 1) + " hasta " + (i + this.limitPerBatch) + " - " + name);
                    await this.service.up(this.limitPerBatch, i);
                }
                totalMigrados = await this.service.countsNew();
                this.printMessage(name,size,totalMigrados, monitor);
            }
        } catch (e) {
            console.log("message error: ", e.message);
            this.printErrorMessage(e, pointer);
            await this.service.down();
            process.exit(20);
        } finally {
            this.printFinish(name);
        }
    }

    private printMessage(name, size, totalMigrados, monitor){
        console.log("**** -- Result " + name + " --- ****");
        if(totalMigrados >= size){
            console.log("**** Se ha migrado satisfactoriamente los registros - total: ", totalMigrados + " ****");
        } else {
            console.log("**** Registros migrados :" + totalMigrados + ", Registros totales: " + size + " ****");
            if(monitor) {
                console.log("**** No se han migrado todos los registros" + " ****");
                process.exit();
            } else {
                console.log("**********");
            }
        }
        console.log("#############");
    }

    private printErrorMessage(e, pointer){
        console.log("--- Se ha producido un error en el registro " + pointer);
        console.log("--- Detalle de error", e.message);
        console.log("--- Eliminando progreso...");
    }

    private printFinish(name){
        console.log("#############################################");
        console.log("##########  Finalizado - Proceso : " + name);
        console.log("#############################################");
    }

}
