import {Order} from "../../models/Order";
import {Exception} from "handlebars";
const xml2js = require('xml2js');
const parserToJson = new xml2js.Parser({ attrkey: "ATTR" });

export const converterPhoneInColombianFormat = (phone) => {
    if(phone && phone.startsWith("+")){
        return phone;
    } else {
        return "+57" + (phone || "");
    }
}

export const converterFirstArrayObject = (array) => {
    if (Array.isArray(array)) {
        return array[0] || null;
    } else {
        return array;
    }
}


/**
 * Convertir un XML en JSON
 */
export const converterXMLInJson = async (_xmlData: string) => {
    try {
        const json = await parserToJson.parseString(_xmlData);
        return json;
    }catch(e){
        throw new Exception("Se registro un error en el XML a leer");
    }

}
