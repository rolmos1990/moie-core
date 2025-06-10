import {BaseService} from "../common/controllers/base.service";
import {ViewCustomerOrder} from "../models/ViewCustomerOrder";
import {CustomerOrderRepository} from "../repositories/customerorder.repository";

export class CustomerOrderService extends BaseService<ViewCustomerOrder> {
    constructor(
        private readonly customerOrderRepository: CustomerOrderRepository<ViewCustomerOrder>
    ){
        super(customerOrderRepository);
    }

    async findAll(){
        return await this.findByObjectWithLimit({}, ['state', 'municipality'], 500);
    }

    async findAllWithPage(skip = 0, limit = 0){
        return await this.findByWithPage({}, ['state', 'municipality'], skip, limit)
    }
}
