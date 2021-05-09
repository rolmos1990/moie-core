import {BaseService} from "../common/controllers/base.service";
import {FieldOption} from "../models/FieldOption";
import {DeliveryMethodRepository} from "../repositories/deliveryMethod.repository";
import {DeliveryMethod} from "../models/DeliveryMethod";
import {OrderProduct} from "../controllers/parsers/orderProduct";
import {IDeliveryCost} from "../common/interfaces/IDeliveryCost";

export class DeliveryMethodService extends BaseService<FieldOption> {
    constructor(
        private readonly deliveryMethodRepository: DeliveryMethodRepository<DeliveryMethod>
    ){
        super(deliveryMethodRepository);
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
}
