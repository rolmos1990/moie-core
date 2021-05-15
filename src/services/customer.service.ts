import {BaseService} from "../common/controllers/base.service";
import {Customer} from "../models/Customer";
import {CustomerRepository} from "../repositories/customer.repository";
import {OrderRepository} from "../repositories/order.repository";
import {Order} from "../models/Order";
import {getAllStatus, isSell, OrderStatus} from "../common/enum/orderStatus";
import {OrderConditional} from "../common/enum/order.conditional";

export class CustomerService extends BaseService<Customer> {
    constructor(
        private readonly customerRepository: CustomerRepository<Customer>,
        private readonly orderRepository: OrderRepository<Order>
    ){
        super(customerRepository);
    }


    /** Obtener el historico de ultimas ordenes de un cliente */
    async getLastOrders(customer: Customer, statuses: OrderStatus[] = getAllStatus(), limit = 5){
        return this.orderRepository.createQueryBuilder(Order.name)
            .select("*")
            .where({
                customer: customer,
            })
            .andWhere('status IN :statuses')
            .setParameter('statuses', statuses)
            .limit(limit)
            .orderBy('createdAt', OrderConditional.DESC).getMany();
    }

    async isMayorist(customer: Customer, itemsBuyed: number, updateEntity: boolean = false) : Promise<boolean>{

        const numberOfItemsMayorist = 6;
        const lastMayoristHistory = 2;

        const orders : Order[] = await this.orderRepository.createQueryBuilder(Order.name)
            .select("*")
            .where({
                customer: customer,
            })
            .andWhere('status IN (:statuses)')
            .setParameter('statuses', isSell())
            .limit(lastMayoristHistory)
            .orderBy('created_at', OrderConditional.DESC).getMany();

        let mayoristHistory = 0;

        if(itemsBuyed >= numberOfItemsMayorist){
            mayoristHistory++;
        }

        if(orders){
            orders.map(item => {
                if(item.quantity >= numberOfItemsMayorist){
                    mayoristHistory++;
                }
            })
        }

        if(mayoristHistory > 0 && updateEntity){
            customer.isMayorist = true;
            await this.customerRepository.save(customer);
        }

        return mayoristHistory > 0;
    }
}
