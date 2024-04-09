import {BaseService} from "../common/controllers/base.service";
import {ViewCustomerOrder} from "../models/ViewCustomerOrder";
import {CustomerOrderRepository} from "../repositories/customerorder.repository";

export class CustomerOrderService extends BaseService<ViewCustomerOrder> {
    constructor(
        private readonly customerOrderRepository: CustomerOrderRepository<ViewCustomerOrder>
    ){
        super(customerOrderRepository);
    }
}
