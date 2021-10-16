import {IColumn} from "../../common/interfaces/IColumns";
import {isEmpty} from "../../common/helper/helpers";

export abstract class BaseExporters {
    abstract getSheetName() : String;
    abstract getFileName() : String;
    abstract getHeader() : IColumn[];
    abstract getBody(objects : any) : any;

    invalidFormat(){
        if(isEmpty(this.getSheetName()) || isEmpty(this.getHeader())){
            return true;
        }
    }
}

