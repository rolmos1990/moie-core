import {OrderShortDTO, OrderShowDTO} from "./order";
import {Bill} from "../../models/Bill";


export const BillListDTO = (bill: Bill) => ({
    id: bill.id,
    createdAt: bill.createdAt,
    tax: bill.tax,
    legalNumber: bill.legalNumber,
    status: bill.status,
    order: OrderShortDTO(bill.order)
});
