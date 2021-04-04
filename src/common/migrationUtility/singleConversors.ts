export const DELIVERY_TYPES = {
    CONTADO: 1,
    AL_COBRO: 2
};

export const convertDeliveryType = (_stringType) => {
    switch(_stringType){
        case "Contado":
            return DELIVERY_TYPES.CONTADO;
        break;
        case "Contado - AlCobro":
            return DELIVERY_TYPES.AL_COBRO;
        break;
        default :
            return null;
        break;
    }
}
