import {BaseService} from "../common/controllers/base.service";
import {Items} from "../models/Items";
import {ItemsRepository} from "../repositories/items.repository";
import {EventItemsRepository} from "../repositories/eventitems.repository";
import {EventItems} from "../models/EventItems";

export class ItemsService extends BaseService<Items> {
    constructor(
        private readonly itemsRepository: ItemsRepository<Items>,
        private readonly eventItemRepository: EventItemsRepository<EventItems>
    ){
        super(itemsRepository);
    }

    async getEvents(){
        return (await this.eventItemRepository.findByObject({}));
    }

    async increaseEvent(type, amount){
        try {

        if(!(amount && amount > 0)){
            return;
        }

        const object = await this.eventItemRepository.findOneByObject({eventType: type});
        object.amount += parseInt(amount);
        return await this.eventItemRepository.save(object);
        }catch(e){
            console.error('error incrementando evento');
        }
    }

    async decreaseEvent(type, amount){
        try {
            if(!(amount && amount > 0)){
                return;
            }

            const object = await this.eventItemRepository.findOneByObject({eventType: type});
            object.amount -= parseInt(amount);

            if(object.amount <= 0){
                return;
            }

            return await this.eventItemRepository.save(object);

        }catch(e){
            console.error('error decrementando evento');
        }
    }


}
