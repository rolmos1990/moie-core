import {Payment} from "../../models/Payment";

export const PaymentCreateDTO = (payment: Payment) => ({
    name: payment.name,
    phone: payment.phone,
    type: payment.type,
    bank: payment.bank,
    number: payment.number,
    amount: payment.amount,
    email: payment.email,
    origen: payment.origen
});
