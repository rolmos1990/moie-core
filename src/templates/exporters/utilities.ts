import moment = require("moment");

export function toDateFormat(date, format = "YYYY-MM-DD") {
    if(!date){
        return "";
    }
    return moment(date).format(format)
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
    const value = item && item.toString();
    if(!value){
        return value;
    }
    return value.toUpperCase();
}
