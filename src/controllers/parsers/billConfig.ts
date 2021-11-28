import {BillConfig} from "../../models/BillConfig";


export const BillConfigListDTO = (bill: BillConfig) => ({
    id: bill.id,
    number: bill.createdAt,
    startNumber: bill.startNumber,
    finalNumber: bill.finalNumber,
    prefix: bill.prefix,
    resolutionDate: bill.resolutionDate,
    createdAt: bill.createdAt,
    status: bill.status
});
