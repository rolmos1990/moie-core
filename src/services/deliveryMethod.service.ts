import {BaseService} from "../common/controllers/base.service";
import {FieldOption} from "../models/FieldOption";
import {DeliveryMethodRepository} from "../repositories/deliveryMethod.repository";
import {DeliveryMethod} from "../models/DeliveryMethod";

export class DeliveryMethodService extends BaseService<FieldOption> {
    constructor(
        private readonly deliveryMethodRepository: DeliveryMethodRepository<DeliveryMethod>
    ){
        super(deliveryMethodRepository);
    }

    async findByCode(code){
        const delivery = await this.deliveryMethodRepository.findByObject({code: code});
        return delivery[0];
    }
}
