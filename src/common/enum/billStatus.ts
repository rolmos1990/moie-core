export enum BillStatus {
    SEND = 'Enviada', //Enviada
    ERROR= 'Error DIAN', //Error de Factura
    NO_MUNICIPALITY= 'Sin Municipio', //No se ingreso municipio
    NO_IDENTITY= 'Sin Cédula', //No se ingreso cedula
    PENDING='Pendiente' //Esta pendiente por envio
};
