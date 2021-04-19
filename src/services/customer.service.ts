import {BaseService} from "../common/controllers/base.service";
import {Customer} from "../models/Customer";
import {CustomerRepository} from "../repositories/customer.repository";

export class CustomerService extends BaseService<Customer> {
    constructor(
        private readonly customerRepository: CustomerRepository<Customer>
    ){
        super(customerRepository);
    }
}
