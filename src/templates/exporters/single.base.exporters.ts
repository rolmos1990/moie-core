import {BaseExporters} from "./base.exporters";

export abstract class SingleBaseExporters extends BaseExporters {

    isMultiple(): boolean {
        return false;
    }

}
