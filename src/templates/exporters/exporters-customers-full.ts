import {EXPORTER_CUSTOMERS_FULL} from "./constants";
import { SingleBaseExporters } from "./single.base.exporters";
import { ViewCustomerOrder } from "../../models/ViewCustomerOrder";
import moment = require("moment");

export class ExportersCustomersFull extends SingleBaseExporters {

    getSheetName(): string {
        return "Worksheet";
    }

    getFileName() {
        return 'Customers.csv';
    }

    getBody(data: ViewCustomerOrder[]) {
        // @ts-ignore
        const body = data.map(item => ({
            firstName: this.getFirstName(item.name),
            lastName : this.getLastName(item.name),
            phoneNumber: item.cellphone.startsWith('+57') ? item.cellphone : `+57${item.cellphone}`,
            email:item.email,
            tags: 'cliente',
            lifecycle: 'CLIENTES',
            Assignee: 'abogadoramiropalmar@gmail.com',
            tallas: '',
            numero_de_cedula: item.document,
            ciudad: (item.municipality && item.municipality.name) || "",
            departamento: (item.state && item.state.name) || "",
            puntoReferencia: item.address || "",
            fechaCompra: item.createdAt ? moment(item.createdAt).format('YYYY/MM/DD') : "",
            valorCompra: item.totalAmount || 0,
            numeroPedido: item.orderCount || 0,
            tipoCliente: this.getTipoCliente(item.isMayorist),
            direccion: item.address || "",
            calidadCliente: this.getCalidadCliente(item.orderCount)

        }));

        return body;
    }

    private getLastName(fullName: string): string {
        const parts = fullName.trim().split(/\s+/);
        parts.shift();
        return parts.join(" ");
    }

    private getFirstName(fullName: string): string {
        const [first = ""] = fullName.trim().split(/\s+/);
        return first;
    }

    private getCalidadCliente(orderCount: number): string {
        if (orderCount >= 3) return "ORO";
        if (orderCount === 2) return "PLATA";
        if (orderCount === 1) return "BRONCE";
        return "";
    }

    private getTipoCliente(isMayorist: boolean): string {
        return isMayorist ? "Mayorista" : "Minorista";
    }

    getHeader() {
        const headers = [
            { header: 'First Name', key: 'firstName' },
            { header: 'Last Name', key: 'lastName' },
            { header: 'Phone Number', key: 'phoneNumber' },
            { header: 'Email', key: 'email' },
            { header: 'Tags', key: 'tags' },
            { header: 'Lifecycle', key: 'lifecycle' },
            { header: 'Assignee', key: 'Assignee' },
            { header: 'tallas', key: 'tallas' },
            { header: 'numero_de_cedula', key: 'numero_de_cedula' },
            { header: 'ciudad', key: 'ciudad' },
            { header: 'departamento', key: 'departamento' },
            { header: 'punto_de_referencia', key: 'puntoReferencia' },
            { header: 'fecha_de_compra', key: 'fechaCompra' },
            { header: 'valor_de_compra', key: 'valorCompra' },
            { header: 'numero_de_pedido', key: 'numeroPedido' },
            { header: 'tipo_de_cliente', key: 'tipoCliente' },
            { header: 'direccion', key: 'direccion' },
            { header: 'calidad_del_cliente', key: 'calidadCliente' }
        ];
        return headers;
    }

    getName() {
        return EXPORTER_CUSTOMERS_FULL;
    }
}
