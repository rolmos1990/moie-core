import {Worksheet} from "exceljs";
import {IMPORTER_INTERRAPIDISIMO} from "./constants";
import {InvalidFileException} from "../../common/exceptions";
import {BaseImporters} from "./base.impoters";
import {ImportersInterrapidisimo} from "./impoters-interrapidisimo";
import {OrderTracking} from "../../common/interfaces/OrderTracking";

export class ImporterImpl extends BaseImporters{
    private importer : BaseImporters;
    constructor(deliveryMethod : string, ws : Worksheet){
        super();
        switch(deliveryMethod){
            case IMPORTER_INTERRAPIDISIMO:
                this.importer = new ImportersInterrapidisimo();
                this.importer.addRows(ws);
            break;
            default:
                throw new InvalidFileException("Tipo de archivo no puede ser procesado");
        }
    }

    addRows(ws: Worksheet): void {
        this.importer.addRows(ws);
    }

    getContext(): OrderTracking[] {
        return this.importer.getContext();
    }

    getName(): string {
        return this.importer.getName();
    }

    hasFiles(): boolean {
        return this.importer.hasFiles();
    }
}
