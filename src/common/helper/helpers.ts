import {Any} from "typeorm";
import {DeliveryWebService} from "../enum/deliveryTypes";

export interface DecodeDataObj {
    type: string,
    data: string
};

export function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) return false;
    }
    return true;
}

export function decodeBase64Image(dataString) : DecodeDataObj | Error {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const rsp:any = {};

    if (matches.length !== 3) {
        return new Error('Fichero invalido');
    }

    rsp.type = matches[1];
    rsp.data = new Buffer(matches[2], 'base64');

    return rsp;
}

export function existsInEntity(entityArray, entitySearch){
    if(!entityArray || entityArray.length <= 0){
        return {exists: false, value: null};
    }
    const exists = entityArray.filter(item =>
        (item.equals(entitySearch)));
    if(exists && exists.length > 0) {
        return {exists: true, value: exists[0]};
    }
    return {exists: false, value: null};
}

export function hasInEnum(keyName, enumerations) {
    for (let key in enumerations) {
        if(keyName.toString().toUpperCase() == key){
            return true;
        }
    }
    return false;
}
