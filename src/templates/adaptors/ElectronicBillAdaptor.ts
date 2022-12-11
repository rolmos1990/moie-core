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

            billAdaptorData.flete = billItem.order.orderDelivery.deliveryCost || 0;

            //customer is unique
            if(billItem.order.customer && !customers.includes(billItem.order.customer)){
                customers.push(billItem.order.customer);
            }

            let subtotal = 0;
            let montoVenta = 0;

            const tax = parseFloat(billItem.tax.toString())

            billItem.order.orderDetails.map((item,index) => {
                let valorUnitario = 0;
                let valorTotal = 0;

                let precioVenta = ((item.price / 100) * (100 - item.discountPercent));
                montoVenta+= precioVenta * item.quantity;
                let montoVentaSinIva = montoVenta / 1.19;
                let restante = montoVentaSinIva - subtotal;

                if((billItem.order.orderDetails.length - 1) == index){
                    precioVenta = restante * 1.19 / item.quantity;
                }

                valorUnitario = (precioVenta * 100 / (100 + tax));
                valorTotal = item.quantity * Number(valorUnitario.toFixed(2));
                subtotal+= valorTotal;

            });

            billAdaptorData.monto_sin_iva = Number(subtotal.toFixed(2));
            billAdaptorData.monto_iva = Number((subtotal * tax / 100).toFixed(2));
            billAdaptorData.monto_con_iva = (subtotal * (100 + tax) / 100);
            this.billAdaptor.push(billAdaptorData);
        });

        return {
            customers: customers,
            bills: this.billAdaptor
        };
    }
}

