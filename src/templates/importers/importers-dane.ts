import {BaseImporters} from "./base.impoters";
import {InvalidFileException} from "../../common/exceptions";
import {IMPORTER_DANE} from "./constants";


export class ImportersDane extends BaseImporters {

    startBy = 2; //number from read file

    addRows(ws) {
        this.ws = ws;

        if(this.hasFiles()){
            //reading all files and add to array
            /** Replace for Order Id And Tracking Id Position */
            const positionOrderId = 35;//AI
            const positionTrackingId = 2;//B
            const positionDeliveryAmountId = 13;//N

            const rows = this.ws.getRows(this.startBy, this.ws.actualRowCount);
            try {
                rows.map(item => {
                    let trackingNumber = item.getCell(positionTrackingId).toString();
                    const deliveryAmount = item.getCell(positionDeliveryAmountId).toString();
                    if(trackingNumber) {
                        trackingNumber = trackingNumber.replace(/ /g, '');
                        let id: any = item.getCell(positionOrderId).toString();
                        id = id.split("-");
                        if (id && id[1]) {
                            id = id[1].replace(/ /g, '');
                            this.collection.push({id, trackingNumber, deliveryAmount});
                        }
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
        return IMPORTER_DANE;
    }

    hasFiles() {
        return this.ws.actualRowCount > 1 ? true : false;
    }

}
