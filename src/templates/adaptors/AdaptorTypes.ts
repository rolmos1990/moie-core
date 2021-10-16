import {Order} from "../../models/Order";
import {BillCreditMemo} from "../../models/BillCreditMemo";
import {BillConfig} from "../../models/BillConfig";
import {Customer} from "../../models/Customer";
import {Bill} from "../../models/Bill";

export type BillAdaptor = {
    id: number,
    order: Order,
    createdAt: Date,
    tax: number,
    legalNumber: string,
    billConfig: BillConfig,
    creditMemo: BillCreditMemo,
    status: string
    monto_iva: number,
    monto_con_iva: number,
    monto_sin_iva: number,
    flete: string
};

export type EBillReport = {
    customers: Customer[],
    bills: BillAdaptor[]
};

export type CreditNoteBillAdaptor = {
    id: number,
    order: Order,
    bill: Bill,
    createdAt: Date,
    tax: number,
    legalNumber: string,
    billConfig: BillConfig,
    creditMemo: BillCreditMemo,
    status: string
    monto_iva: number,
    monto_con_iva: number,
    monto_sin_iva: number,
    flete: string
};

export type CreditNoteBillReport = {
    customers: Customer[],
    bills: CreditNoteBillAdaptor[]
};
