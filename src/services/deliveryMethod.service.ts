import {BaseService} from "../common/controllers/base.service";
import {DeliveryMethodRepository} from "../repositories/deliveryMethod.repository";
import {DeliveryMethod} from "../models/DeliveryMethod";
import {OrderProduct} from "../controllers/parsers/orderProduct";
import {IDeliveryCost} from "../common/interfaces/IDeliveryCost";
import {hasInEnum} from "../common/helper/helpers";
import {DeliveryLocation, DeliveryWebService} from "../common/enum/deliveryTypes";
import {Customer} from "../models/Customer";
import {InvalidArgumentException} from "../common/exceptions";
import {OrderDelivery} from "../models/OrderDelivery";
import {DeliveryLocalityService} from "./deliveryLocality.service";
import {Order} from "../models/Order";
import {DeliveryStatusImpl, TrackingDelivery} from "../common/requesters/deliveries/DeliveryStatusImpl";
import {OrderDeliveryService} from "./orderDelivery.service";
import {OrderUpdate, OrderUpdateDTO} from "../controllers/parsers/order";

export class DeliveryMethodService extends BaseService<DeliveryMethod> {
    constructor(
        private readonly deliveryMethodRepository: DeliveryMethodRepository<DeliveryMethod>,
        private readonly deliveryLocalityService: DeliveryLocalityService,
        private readonly orderDeliveryService: OrderDeliveryService
    ){
        super(deliveryMethodRepository);
    }

    /** Obtiene el tipo de dirección que trabaja el metodo de Envio */
    async deliveryMethodAddress(deliveryMethod: DeliveryMethod, customer: Customer, locality: number = null, tracking = null) : Promise<OrderDelivery>{
        const orderDelivery = new OrderDelivery();

        if(!deliveryMethod){
            throw new InvalidArgumentException("Metodo de envio es requerido");
        }
        /** Metodo de Envio con Servicios Web */
        /** TODO -- Has Web Service (Factory Client Web Service ) */
        if(hasInEnum(deliveryMethod, DeliveryWebService)){
            return orderDelivery;
        }

        /** Metodo de Envio con DeliveryLocation */
        if(locality && hasInEnum(deliveryMethod, DeliveryLocation)){
            try {
                const deliveryLocality = await this.deliveryLocalityService.find(locality);
                orderDelivery.deliveryLocality = deliveryLocality;
                if(orderDelivery.tracking){
                    orderDelivery.tracking = tracking;
                }
                return orderDelivery;
            }catch(e){
                throw new InvalidArgumentException("No se ha encontrado la localidad seleccionada");
            }
        }

        /** Metodo de Envio por Defecto - Toma la dirección del cliente */
        console.log("CUSTOMER", customer);
        if(!customer.state || !customer.municipality){
            throw new InvalidArgumentException("Dirección de cliente es requerida");
        }

        orderDelivery.deliveryState = customer.state.name;
        orderDelivery.deliveryMunicipality = customer.municipality.name;

        return orderDelivery;

    }

    async deliveryMethodCost(deliveryMethod: DeliveryMethod, products: OrderProduct[]) : Promise<IDeliveryCost>{

        /** Todo -- Calculo de envios y crear un factory por tipo de envios */
        /** Calcular envios */

        /** Calcular tasa de envios y costos */
        /** Entrega costos, referencia, fecha y otros */
        const deliveryCost: IDeliveryCost = {
            reference: "",
            cost: 0.00,
            deliveryMethodData: {}
        }

        return deliveryCost;
    }

    async findByCode(code){
        const delivery = await this.deliveryMethodRepository.findByObject({code: code});
        return delivery[0];
    }

    /** Allow to update the delivery status from a order list */
    async syncDeliveries(orders: Order[]){

        let updates = 0;
        let failed = 0;

        await Promise.all(orders.map(async item => {
            try {
            const requested = new DeliveryStatusImpl(item);
                const tracking: TrackingDelivery = await requested.call();
                item.orderDelivery.deliveryStatusDate = tracking.date;
                item.orderDelivery.deliveryStatus = tracking.status;
                item.orderDelivery.sync = tracking.sync;
                item.orderDelivery.deliveryCurrentLocality = tracking.locality;
                await this.orderDeliveryService.createOrUpdate(item.orderDelivery);
                updates++;
            }catch(e){
                failed++;
                console.log("no se ha podido actualizar la orden");
            }
        }));

        return {failed, updates};
    }
}
