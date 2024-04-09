import {EXPORTER_CUSTOMERS} from "./constants";
import {SingleBaseExporters} from "./single.base.exporters";
import {Customer} from "../../models/Customer";
import {ViewCustomerOrder} from "../../models/ViewCustomerOrder";

export class ExportersCustomers extends SingleBaseExporters {

    getSheetName(): String {
        return "Worksheet";
    }

    getFileName(){
        return 'Customers.xlsx';
    }
    getBody(data: ViewCustomerOrder[]) {

        const body = data.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.cellphone,
            createdAt: item.createdAt,
            chargeOnDelivery: item.status,
            orderCount: item.orderCount
        }));

        return body;
    }

    getHeader() {
        const headers = [
            { header: 'ID', key: 'id' },
            { header: 'NAME', key: 'name'},
            { header: 'EMAIL', key: 'email'},
            { header: 'TELEFONO', key: 'phone'},
            { header: 'FECHA CREACION', key: 'createdAt'},
            { header: 'CONTRAPAGO', key: 'chargeOnDelivery'},
            { header: 'CANTIDAD_PEDIDOS', key: 'orderCount'}
        ];;
        return headers;
    }

    getName() {
        return EXPORTER_CUSTOMERS;
    }

}
