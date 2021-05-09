export enum PaymentModes {
    CASH = 1, //PAGO EN EFECTIVO
    WIRETRANSFER= 2, //TRANSFERENCIA BANCARIA
};

export const isPaymentMode = (paymentMode) => {
    return [PaymentModes.CASH,PaymentModes.WIRETRANSFER].includes(paymentMode);
}
