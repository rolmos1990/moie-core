import express = require('express');
import {createContainer, asClass} from "awilix";
import { scopePerRequest } from "awilix-express";
import {CategoryService} from "./services/category.service";
import {ProductService} from "./services/product.service";
import {SizeService} from "./services/size.service";
import {ProductSizeService} from "./services/productSize.service";
import {DeliveryLocalityService} from "./services/deliveryLocality.service";
import {StateService} from "./services/state.service";
import {MunicipalityService} from "./services/municipality.service";
import {CustomerService} from "./services/client.service";
import {ProductImageService} from "./services/productImage.service";
import {UserService} from "./services/user.service";
import {OfficeService} from "./services/office.service";
import {PaymentService} from "./services/payment.service";
import {OrderService} from "./services/order.service";
import {CommentCustomerService} from "./services/commentCustomer.service";
import {CommentOrderService} from "./services/commentOrder.service";
import {OrderDetailService} from "./services/orderDetail.service";
import {OrderHistoricService} from "./services/orderHistoric.service";
import {BillConfigService} from "./services/billConfig.service";
import {BillService} from "./services/bill.service";
import {BillCreditMemoService} from "./services/billCreditMemo.service";
import {CommentPostSaleService} from "./services/commentPostSale.service";
import {AttachmentService} from "./services/attachment.service";
import {MovementService} from "./services/movement.service";

export default (app): void => {
    const container = createContainer({
        injectionMode: 'CLASSIC'
    });

    container.register({
        // Servicios de Migración
        categoryService: asClass(CategoryService).scoped(),
        productService: asClass(ProductService).scoped(),
        sizeService: asClass(SizeService).scoped(),
        productSizeService: asClass(ProductSizeService).scoped(),
        deliveryLocalityService: asClass(DeliveryLocalityService).scoped(),
        stateService: asClass(StateService).scoped(),
        municipalityService: asClass(MunicipalityService).scoped(),
        customerService: asClass(CustomerService).scoped(),
        productImageService: asClass(ProductImageService).scoped(),
        userService: asClass(UserService).scoped(),
        officeService: asClass(OfficeService).scoped(),
        paymentService: asClass(PaymentService).scoped(),
        orderService: asClass(OrderService).scoped(),
        commentCustomerService: asClass(CommentCustomerService).scoped(),
        commentOrderService: asClass(CommentOrderService).scoped(),
        orderDetailService: asClass(OrderDetailService).scoped(),
        orderHistoricService: asClass(OrderHistoricService).scoped(),
        billConfigService: asClass(BillConfigService).scoped(),
        billService: asClass(BillService).scoped(),
        billCreditMemoService: asClass(BillCreditMemoService).scoped(),
        commentPostSaleService: asClass(CommentPostSaleService).scoped(),
        movementService: asClass(MovementService).scoped(),
        attachmentService: asClass(AttachmentService).scoped(),
    });

    app.use(scopePerRequest(container));
};
