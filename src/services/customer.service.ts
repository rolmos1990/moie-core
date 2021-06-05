import {BaseService} from "../common/controllers/base.service";
import {Customer} from "../models/Customer";
import {CustomerRepository} from "../repositories/customer.repository";
import {OrderRepository} from "../repositories/order.repository";
import {Order} from "../models/Order";
import {getAllStatus, isSell, OrderStatus} from "../common/enum/orderStatus";
import {OrderConditional} from "../common/enum/order.conditional";
import {OrderDetail} from "../models/OrderDetail";
import {OrderDetailRepository} from "../repositories/orderDetail.repository";
import moment = require("moment");

export class CustomerService extends BaseService<Customer> {
    constructor(
        private readonly customerRepository: CustomerRepository<Customer>,
        private readonly orderRepository: OrderRepository<Order>,
        private readonly orderDetailRepository: OrderDetailRepository<OrderDetail>
    ){
        super(customerRepository);
    }

    /** Obtener el historico de ultimas ordenes de un cliente */
    /** Customer null get all customers */
    /** Status null get by all status */
    /** beforeDate and afterDate are optionals */
    async getOrdersByProduct(customer: Customer, statuses: OrderStatus[] = getAllStatus(), beforeDate, afterDate, categoryMode = false){
        console.log("BEFORE DATE SEARCH -- ", beforeDate);
        const query = this.orderDetailRepository.createQueryBuilder("orderDetail")
            .leftJoinAndSelect('orderDetail.product', 'p')
            .leftJoinAndSelect("orderDetail.order", "o");

        let params = {'statuses': statuses};

        if(customer != null){
            query.andWhere("o.customer = :customer");
            params['customer'] = customer.id;
        }
        if(beforeDate) {
            query.andWhere("o.createdAt < :before");
            params['before'] = beforeDate;
        }
        if(afterDate){
            query.andWhere("o.createdAt >= :after");
            params['after'] = afterDate;
        }

        if(categoryMode){
            query.leftJoinAndSelect('p.category', 'c');
            query.groupBy("p.category");
            query.select("c.id as categoryId, SUM(orderDetail.price) as sumPrices, SUM(orderDetail.quantity) AS qty, c.name AS name");
        } else {
            query.groupBy("orderDetail.product");
            query.select("orderDetail.product as productId, SUM(orderDetail.price) as sumPrices, SUM(orderDetail.quantity) AS qty, p.name AS name");
        }

        query.andWhere('o.status IN (:statuses)')
        query.setParameters(params);

        return await query.getRawMany();
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
