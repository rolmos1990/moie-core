export enum OrderStatus {
    PENDING = 1, //RESERVADA
    CONFIRMED= 2, //CONFIRMADA
    PRINTED= 3, //IMPRESA
    SENT= 4, //ENVIADA
    RECONCILED= 5, //CONCILIADA
    CANCELED = 6, //ANULADA
};

export const OrderStatusNames = {
    [OrderStatus.PENDING] : "PENDIENTE",
    [OrderStatus.CONFIRMED] : "CONFIRMADA",
    [OrderStatus.PRINTED] : "IMPRESA",
    [OrderStatus.SENT] : "ENVIADA",
    [OrderStatus.RECONCILED] : "CONCILIADA",
    [OrderStatus.CANCELED] : "CANCELADA"
};

/** Todos los estados de las ordenes */
export function getAllStatus(){
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PRINTED, OrderStatus.SENT, OrderStatus.RECONCILED];
}

/** Orden no puede ser modificada */
export function getClosed(){
    return [OrderStatus.CANCELED, OrderStatus.RECONCILED];
}

/** Orden es cancelable */
export function isCancellable(){
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED];
}

/** Ordenes que han sido vendidas */
export function isSell(){
    return [OrderStatus.PRINTED, OrderStatus.SENT, OrderStatus.RECONCILED];
}
