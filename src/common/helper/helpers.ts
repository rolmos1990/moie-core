import {Any} from "typeorm";
import * as Bcrypt from "bcryptjs";
import {OrderDetail} from "../../models_moie/OrderDetail";

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


export function getCalculateCosts(orderDetails: OrderDetail[]) {
    let totalAmount : number = 0;
    let totalWeight : number = 0;
    let totalDiscount = 0;
    let totalRevenue = 0;
    orderDetails.map(item => {
        totalWeight += item.product ? Number(item.product.weight || 0) * Number(item.quantity) : 0;
        if (item.adjustment > 0) {
            totalDiscount += ((Number(item.price) * Number(item.adjustment)) / 100) * Number(item.quantity);
        } else {
            totalDiscount = 0;
        }
        totalAmount += Number(item.price) * Number(item.quantity);
        const revenue = item.price - item.cost;

        totalRevenue += revenue;
    });

    return {
        totalAmount,
        totalWeight,
        totalDiscount,
        totalRevenue
    };
}
