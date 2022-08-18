import moment = require("moment");
import {Customer} from "../../models/Customer";
import {isEmpty} from "../../common/helper/helpers";

export function toDateFormat(date, format = "YYYY-MM-DD") {
    if(date === null){
        return "";
    }
    const _date  = moment(date, 'YYYY-MM-DD').format(format);
    return _date;
}

export function toFixed (item) {
    const value = item && item;
    if(!value){
        return "0.00";
    }
    return value.toFixed(2);
}

export function toFloat(item) {
    const value = item && item.toString();
    if(!value){
        return 0.00;
    }
    return parseFloat(value);
}

export function toUpper(item) {
    try {
        const value = item && item.toString();
        if (!value) {
            return value;
        }
        return value.toUpperCase();
    }catch(e){
        console.log("error reportado", e.message);
        return "";
    }
}


export function customerLocality(customer: Customer) {
    try {
        return (customer.state && customer.state.name) + " - " + (customer.municipality && customer.municipality.name);
    }catch(e){
        return "";
    }
}
