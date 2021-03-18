import {BaseService} from "../common/controllers/base.service";
import {DeliveryLocality} from "../models/DeliveryLocality";
import {DeliveryLocalityRepository} from "../repositories/deliveryLocality.repository";

export class DeliveryLocalityService extends BaseService<DeliveryLocality> {
    constructor(
        private readonly deliveryLocalityRepository: DeliveryLocalityRepository<DeliveryLocality>
    ){
        super(deliveryLocalityRepository);
    }
}
