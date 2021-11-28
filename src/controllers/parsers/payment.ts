import {Payment} from "../../models/Payment";

export const PaymentCreateDTO = (payment: Payment) => ({
    name: payment.name,
    phone: payment.phone,
    type: payment.type,
    targetBank: payment.targetBank,
    originBank: payment.originBank || null,
    consignmentNumber: payment.consignmentNumber,
    consignmentAmount: payment.consignmentAmount,
    email: payment.email,
    origen: payment.origen
});
