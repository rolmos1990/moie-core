import {BaseService} from "../common/controllers/base.service";
import {Payment} from "../models/Payment";
import {PaymentRepository} from "../repositories/payment.repository";

export class PaymentService extends BaseService<Payment> {
    constructor(
        private readonly paymentRepository: PaymentRepository<Payment>
    ){
        super(paymentRepository);
    }
}
