export enum OrderStatus {
    PENDING = 1, //RESERVADA
    CONFIRMED= 2, //CONFIRMADA
    PRINTED= 3, //IMPRESA
    SENT= 4, //ENVIADA
    RECONCILED= 5, //CONCILIADA
    CANCELED = 6, //ANULADA
    FINISHED = 7 //FINALIZADA
};

export const OrderStatusNames = {
    [OrderStatus.PENDING] : "PENDIENTE",
    [OrderStatus.CONFIRMED] : "CONFIRMADO",
    [OrderStatus.PRINTED] : "IMPRESO",
    [OrderStatus.SENT] : "ENVIADO",
    [OrderStatus.RECONCILED] : "CONCILIADO",
    [OrderStatus.CANCELED] : "CANCELADO",
    [OrderStatus.FINISHED] : "FINALIZADO"
};

/** Todos los estados de las ordenes */
export function getAllStatus(){
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PRINTED, OrderStatus.SENT, OrderStatus.RECONCILED, OrderStatus.FINISHED];
}

/** Orden es cancelable */
export function isCancellable(){
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED];
}

/** Orden es cancelable */
export function isNotCancelled(){
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PRINTED, OrderStatus.SENT, OrderStatus.RECONCILED, OrderStatus.FINISHED];
}

/** Ordenes que han sido vendidas */
export function isSell(){
    return [OrderStatus.CONFIRMED, OrderStatus.PRINTED, OrderStatus.SENT, OrderStatus.RECONCILED, OrderStatus.FINISHED];
}
