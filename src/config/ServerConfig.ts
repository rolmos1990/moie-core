import {PaymentService} from "../services/payment.service";
import {OrderService} from "../services/order.service";

const TIME_DEFAULT = Math.floor(Date.now() / 1000) + (60 * 60); //1 Hour

export const serverConfig = {
    jwtExpiration: process.env.jWT_EXPIRATION || TIME_DEFAULT,
    jwtSecret: process.env.JWT_SECRET || "test",
    isFakeCounters: false,
    fakeCounterLimit: 5000,
    includeServices: [PaymentService.name] //[PaymentService.name, OrderService.name]
};
