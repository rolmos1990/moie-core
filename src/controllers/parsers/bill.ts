import {OrderListDTO, OrderShortDTO, OrderShowDTO} from "./order";
import {Bill} from "../../models/Bill";


export const BillListDTO = (bill: Bill) => ({
    id: bill.id,
    createdAt: bill.createdAt,
    tax: bill.tax,
    legalNumber: bill.billConfig && bill.billConfig.prefix ? bill.billConfig.prefix : ""  + "" + bill.legalNumber,
    status: bill.status,
    order: OrderListDTO(bill.order)
});
