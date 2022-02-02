import {Payment} from "../../models/Payment";
import {OrderPaymentShowDTO} from "./order";

export const PaymentCreateDTO = (payment: Payment) => ({
    name: payment.name,
    phone: payment.phone,
    type: payment.type,
    targetBank: payment.targetBank,
    originBank: payment.originBank || null,
    consignmentNumber: payment.consignmentNumber,
    consignmentAmount: payment.consignmentAmount,
    email: payment.email,
    origen: payment.origen,
    status: 0
});


export const PaymentDetailDTO = (payment: Payment) => ({
    id: payment.id,
    name: payment.name,
    phone: payment.phone,
    type: payment.type,
    targetBank: payment.targetBank,
    originBank: payment.originBank || null,
    consignmentNumber: payment.consignmentNumber,
    consignmentAmount: payment.consignmentAmount,
    email: payment.email,
    origen: payment.origen,
    status: payment.status,
    createdAt: payment.createdAt,
    order: payment.order && OrderPaymentShowDTO(payment.order)
});
