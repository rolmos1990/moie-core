export enum PaymentModes {
    CASH = 1, //PAGO EN EFECTIVO
    WIRETRANSFER= 2, //TRANSFERENCIA BANCARIA
};

export const isPaymentMode = (paymentMode) => {
    return [PaymentModes.CASH,PaymentModes.WIRETRANSFER].includes(paymentMode);
}

export const isCash = (paymentMode) => {
    if(!paymentMode){
        return false;
    }
    if(paymentMode == PaymentModes.CASH){
        return true;
    }
    return false;
}
