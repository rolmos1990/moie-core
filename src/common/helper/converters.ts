export const converterPhoneInColombianFormat = (phone) => {
    if(phone.startsWith("+")){
        return phone;
    } else {
        return "+57" + phone;
    }
}
