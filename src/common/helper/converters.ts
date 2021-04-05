export const converterPhoneInColombianFormat = (phone) => {
    if(phone.startsWith("+")){
        return phone;
    } else {
        return "+57" + phone;
    }
}

export const converterFirstArrayObject = (array) => {
    if(Array.isArray(array)){
        return array[0] || null;
    } else {
        return array;
    }
}
