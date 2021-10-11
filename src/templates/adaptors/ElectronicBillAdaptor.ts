import {Bill} from "../../models/Bill";
import {BillAdaptor, EBillReport} from "./AdaptorTypes";
import {Customer} from "../../models/Customer";
import {TemplateAdaptor} from "./TemplateAdaptor";

export class ElectronicBillAdaptor extends TemplateAdaptor<Bill[]> {
    private billAdaptor : BillAdaptor[];
    protected resource: Bill[];

    getData() : EBillReport {
        this.billAdaptor = [];
        let customers = [];

        this.resource.map(billItem => {
            let billAdaptorData : any = {...billItem};
            let subtotal = 0;
            let montoVenta = 0;

            //customer is unique
            if(billItem.order.customer && !customers.includes(billItem.order.customer)){
                customers.push(billItem.order.customer);
            }

            billItem.order.orderDetails.map((item,index) => {
                let valorUnitario = 0;
                let valorTotal = 0;
                let precioVenta = 0;
                let montoVentaSinIva = 0;
                let restante = 0;

                precioVenta = item.price / 100 * (100 - item.discountPercent);
                montoVenta+= (item.price / 100 * (100 - item.discountPercent)) * item.quantity;
                montoVentaSinIva = montoVenta / 1.19;
                restante = montoVentaSinIva - subtotal;

                if((billItem.order.orderDetails.length - 1) == index){
                    precioVenta = restante * 1.19 / item.quantity;
                }

                valorUnitario = (precioVenta * 100 / (100 + billItem.tax));
                valorTotal = item.quantity * valorUnitario;
                subtotal+= valorTotal;

            });

            billAdaptorData.monto_con_iva = subtotal * (100 + billItem.tax) / 100;
            billAdaptorData.monto_sin_iva = subtotal;
            billAdaptorData.monto_iva = (subtotal * billItem.tax / 100);
            this.billAdaptor.push(billAdaptorData);
        });

        return {
            customers: customers,
            bills: this.billAdaptor
        };
    }
}

