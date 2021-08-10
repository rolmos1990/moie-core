import {IColumn} from "../../common/interfaces/IColumns";

export abstract class BaseExporters {
    abstract getName() : string;
    abstract getSheetName() : String;
    abstract getFileName() : String;
    abstract getHeader() : IColumn[];
    abstract getBody(objects : any) : any;
}

