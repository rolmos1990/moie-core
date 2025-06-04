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
            nombre: item.name,
            canales: "Lucy Modas Col (WhatsApp Business Platform (API)",
            cicloDeVida: "CLIENTES", // Valor fijo
            correoElectronico: item.email || "",
            telefono: item.cellphone,
            etiquetas: "cliente", // Ajustable si tienes info de etiquetas
            pais: "Colombia", // Valor fijo
            idioma: "", // Si lo tienes disponible, agrégalo
            estadoConversacion: "Cerradas", // Suposición basada en status booleano
            cesionario: "", // ¿Agente asignado?
            ultimoMensaje: item.createdAt ? moment(item.createdAt).format('LLL') : "",
            fechaAdicion: item.createdAt ? moment(item.createdAt).format('LLL') : "",
            tallas: "", // No disponible en el modelo
            numeroCedula: item.document,
            ciudad: (item.municipality && item.municipality.name) || "",
            departamento: (item.state && item.state.name) || "",
            puntoReferencia: item.address || "",
            fechaCompra: item.createdAt ? moment(item.createdAt).format('DD/MM/YYYY') : "",
            valorCompra: item.totalAmount || 0,
            numeroPedido: item.orderCount || 0, // Si tienes acceso a pedidos, aquí iría el número
            tipoCliente: this.getTipoCliente(item.isMayorist),
            direccion: item.address || "",
            calidadCliente: this.getCalidadCliente(item.orderCount)  // ¿Algún scoring de calidad?
        }));

        return body;
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
            { header: 'Nombre', key: 'nombre' },
            { header: 'Canal(es)', key: 'canales' },
            { header: 'Ciclo de vida', key: 'cicloDeVida' },
            { header: 'Correo electrónico', key: 'correoElectronico' },
            { header: 'Teléfono', key: 'telefono' },
            { header: 'Etiquetas', key: 'etiquetas' },
            { header: 'País', key: 'pais' },
            { header: 'Idioma', key: 'idioma' },
            { header: 'Estado de la conversación', key: 'estadoConversacion' },
            { header: 'Cesionario', key: 'cesionario' },
            { header: 'Último mensaje', key: 'ultimoMensaje' },
            { header: 'Fecha de adición', key: 'fechaAdicion' },
            { header: 'Tallas', key: 'tallas' },
            { header: 'Numero de Cédula', key: 'numeroCedula' },
            { header: 'Ciudad', key: 'ciudad' },
            { header: 'Departamento', key: 'departamento' },
            { header: 'Punto de Referencia', key: 'puntoReferencia' },
            { header: 'Fecha de compra', key: 'fechaCompra' },
            { header: 'Valor de compra', key: 'valorCompra' },
            { header: 'Numero de Pedido', key: 'numeroPedido' },
            { header: 'Tipo de Cliente', key: 'tipoCliente' },
            { header: 'Direccion', key: 'direccion' },
            { header: 'Calidad del Cliente', key: 'calidadCliente' }
        ];
        return headers;
    }

    getName() {
        return EXPORTER_CUSTOMERS_FULL;
    }
}
