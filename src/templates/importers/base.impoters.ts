import {OrderTracking} from "../../common/interfaces/OrderTracking";
import {Rows, Worksheet} from "exceljs";

export abstract class BaseImporters {

    protected ws : Worksheet;
    protected startBy : number;
    protected collection : OrderTracking[] = [];

    abstract getName() : string;
    abstract hasFiles() : boolean;
    abstract addRows(ws : Worksheet) : void;
    abstract getContext() : OrderTracking[];
}

