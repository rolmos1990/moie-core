import {Any} from "typeorm";
import * as Bcrypt from "bcryptjs";

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

export async function getPasswordAndSalt(password: string) {
    const salt = Bcrypt.genSaltSync();
    return {password: Bcrypt.hashSync(password, salt), salt: salt};
}
