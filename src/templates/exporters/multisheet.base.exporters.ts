import {BaseExporters} from "./base.exporters";
import {IColumn} from "../../common/interfaces/IColumns";

export abstract class MultisheetBaseExporters extends BaseExporters {

    private cursor = -1;

    /** Define structure */
    abstract defineSheetName(): String[];
    abstract defineHeaders(): IColumn[][];

    getSheetName(): String {
        return this.defineSheetName()[this.cursor];
    }

    getHeader(): IColumn[] {
        return this.defineHeaders()[this.cursor];
    }

    hasNextIterator(){
        return (this.defineSheetName().length - 1) > this.cursor;
    }

    getNextIterator(){
        this.cursor++;
    }

    getCurentIterator(){
        return this.cursor;
    }

    isMultiple(): boolean {
        return true;
    }

}
