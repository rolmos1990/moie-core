import {Order} from "../../models/Order";
import {BaseImporters} from "./base.impoters";
import {OrderTracking} from "../../common/interfaces/OrderTracking";
import {InvalidFileException} from "../../common/exceptions";
import {IMPORTER_INTERRAPIDISIMO} from "./constants";


export class ImportersInterrapidisimo extends BaseImporters {

    startBy = 2; //number from read file

    addRows(ws) {
        this.ws = ws;

        if(this.hasFiles()){
            //reading all files and add to array
            /** Replace for Order Id And Tracking Id Position */
            const positionOrderId = 10;//J
            const positionTrackingId = 1;//A

            const rows = this.ws.getRows(this.startBy, this.ws.actualRowCount);
            try {
                rows.map(item => {
                    const trackingNumber = item.getCell(positionTrackingId).toString();
                    let id : any = item.getCell(positionOrderId).toString();
                    id = id.split("-");
                    if(id && id[1]) {
                        id = id[1].replace(/ /g, '');
                        this.collection.push({id, trackingNumber});
                    }
                });
            }catch(e){
                console.log("error", e.message);
                throw new InvalidFileException("Se ha producido un error leyendo el fichero");
            }
        }
    }

    getContext() {
        return this.collection;
    }

    getName() {
        return IMPORTER_INTERRAPIDISIMO;
    }

    hasFiles() {
        return this.ws.actualRowCount > 1 ? true : false;
    }

}
