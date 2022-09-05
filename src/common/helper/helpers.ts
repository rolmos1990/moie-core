import {DeliveryTypes, DeliveryWebService} from "../enum/deliveryTypes";
import {OrderDetail} from "../../models/OrderDetail";
import {ProductSize} from "../../models/ProductSize";
import {ProductCatalogView} from "../../models/ProductCatalogView";
import {CONFIG_MEDIA} from "../../services/mediaManagement.service";
const bwipjs = require('bwip-js');
const FormData = require('form-data');


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

function textToBarCodeBase64 (text, height, width) {
    return new Promise((resolve, reject) => {
        bwipjs.toBuffer({
            bcid: 'code128',
            text: text + "",
            scaleX: 2,
            scaleY: 2,
            height: 6,
            includetext: false,
            textxalign: 'center',
        }, function(error, buffer) {
            if(error) {
                reject(error)
            } else {
                let gifBase64 = `data:image/gif;base64,${buffer.toString('base64')}`
                resolve(gifBase64)
            }
        })
    })
}

/** Entrega una HTML de Imagen Código QR */
export async function QrBarImage(text, height = 400, width = 100){
    try {
        const imgsrc = await textToBarCodeBase64(text, height, width);
        return '<img src="' + imgsrc + '" />';
    }catch(e){
        console.log("se ha producido un error al obtener la imagen", e.message);
        return '<div title="ImageNotFound"></div>'
    }
}

export function getDeliveryShortType(deliveryType){
    switch(deliveryType){
        case DeliveryTypes.PREVIOUS_PAYMENT:
            return "PP";
        break;
        case DeliveryTypes.PAY_ONLY_DELIVERY:
            return "PP COD";
        break;
        case DeliveryTypes.CHARGE_ON_DELIVERY:
            return "CE";
        break;
        default:
            "";
    }
}

export function encodeToBase64(text){
    try {
        return Buffer.from(text).toString('base64');
    }catch(e){
        return text;
    }
}

export function ArrayToObject(arr, fieldName, fieldValue) {
    let rv = {};
    for (let i = 0; i < arr.length; ++i)
        rv[arr[i][fieldName]] = arr[i][fieldValue];
    return rv;
}

/** Define custom format for value */
export function currencyFormat(number, currency = "COP", locale = 'es-CO'){
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: currency }).format(number)
}

export function roundDecimals(number, outputString = false){
    //return number;
    const _round = number.toFixed(2);
    if(outputString){
        return _round;
    }
    return parseFloat(_round);
}


export function string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

export function string_to_hex (str) {
    return Buffer.from(str, 'utf8').toString('hex');
}

//Ayuda a obtener el diff de un detalle
export function getRealOrderDetail(_orderDetails: OrderDetail[], _oldDetails: OrderDetail[]) : OrderDetail[] {
    return _orderDetails.map(item => {
        const oldProduct = (_oldDetails.filter(oldItem => oldItem.productSize.id == item.productSize.id))[0];
        if (oldProduct) {
            item.quantity -= oldProduct.quantity;
        }
        return item;
    });
}

//Ayuda a obtener el diff de un inventario
export function getRealInventary(productSizes: ProductSize[], _orderDetails: OrderDetail[]) : ProductSize[] {
    return productSizes.map(item => {
        const orderProduct = (_orderDetails.filter(orderItem => orderItem.productSize.id == item.id))[0];
        if(orderProduct) {
            item.quantity -= orderProduct.quantity;
        }
        return item;
    });
}

export function toFormData(items) {
    let datos = new FormData();
    for (let i in items){
        datos.append( i, items[i] );
    }
    return datos;
}

//resolution -> (high, medium, small)
export function getCatalogImage(p: ProductCatalogView, _image, resolution) {

    const defaultImage = CONFIG_MEDIA.DEFAULT_IMAGE;
    const defaultUrl = CONFIG_MEDIA.LOCAL_PATH;

    if(p[_image]){
        var metaImages = false;
        try {
            metaImages = JSON.parse(JSON.parse(p[_image]));
        }catch(e){
            metaImages = JSON.parse(p[_image]);
        }

        if(metaImages){
            return defaultUrl + "/" + (metaImages[resolution]);
        } else {
            return defaultImage;
        }
    }

}
