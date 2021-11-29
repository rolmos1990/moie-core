import {BillConfig} from "../../models/BillConfig";

export const BillConfigCreateDTO = (bill: BillConfig) => ({
    number: bill.number,
    startNumber: bill.startNumber,
    finalNumber: bill.finalNumber,
    prefix: bill.prefix,
    resolutionDate: bill.resolutionDate,
    createdAt: bill.createdAt,
    status: bill.status
});


export const BillConfigListDTO = (bill: BillConfig) => ({
    id: bill.id,
    number: bill.number,
    startNumber: bill.startNumber,
    finalNumber: bill.finalNumber,
    prefix: bill.prefix,
    resolutionDate: bill.resolutionDate,
    createdAt: bill.createdAt,
    status: bill.status
});
