import express = require('express');
import {createContainer, asClass} from "awilix";
import { scopePerRequest } from "awilix-express";
import { UserService } from "./services/user.service";
import {UserRepository} from './repositories/user.repository';
import {CustomerService} from "./services/customer.service";
import {DeliveryLocalityService} from "./services/deliveryLocality.service";
import {MunicipalityService} from "./services/municipality.service";
import {StateService} from "./services/state.service";
import {CustomerRepository} from "./repositories/customer.repository";
import {MunicipalityRepository} from "./repositories/municipality.repository";
import {StateRepository} from "./repositories/state.repository";
import {DeliveryLocalityRepository} from "./repositories/deliveryLocality.repository";
import {ProductRepository} from "./repositories/product.repository";
import {SizeRepository} from "./repositories/size.repository";
import {ProductService} from "./services/product.service";
import {SizeService} from "./services/size.service";
import {CategoryRepository} from "./repositories/category.repository";
import {CategoryService} from "./services/category.service";
import {ProductSizeService} from "./services/productSize.service";
import {ProductSizeRepository} from "./repositories/productSize.repository";
import {ProductImageRepository} from "./repositories/productImage.repository";
import {ProductImageService} from "./services/productImage.service";
import {MediaManagementService} from "./services/mediaManagement.service";
import {FieldOptionService} from "./services/fieldOption.service";
import {FieldOptionRepository} from "./repositories/fieldOption.repository";
import {DeliveryMethodService} from "./services/deliveryMethod.service";
import {DeliveryMethodRepository} from "./repositories/deliveryMethod.repository";
import {OrderRepository} from "./repositories/order.repository";
import {OrderService} from "./services/order.service";
import {OrderDetailRepository} from "./repositories/orderDetail.repository";
import {NotificationRepository} from "./repositories/notification.repository";
import {NotificationService} from "./services/notification.service";
import {OrderDeliveryRepository} from "./repositories/orderDelivery.repository";
import {OrderDeliveryService} from './services/orderDelivery.service';
import {TemplateService} from "./services/template.service";
import {TemplateRepository} from "./repositories/template.repository";
import {CommentService} from "./services/comment.service";
import {CommentRepository} from "./repositories/comment.repository";
import {BatchRequestService} from "./services/batchRequest.service";
import {BatchRequestRepository} from "./repositories/batchRequest.repository";
import {OfficeRepository} from "./repositories/office.repository";
import {OfficeService} from "./services/office.service";
import {BillService} from "./services/bill.service";
import {BillRepository} from "./repositories/bill.repository";
import {BillConfigRepository} from "./repositories/billConfig.repository";
import {BillCreditMemoRepository} from "./repositories/billCreditMemo.repository";
import {ClientsManagementService} from "./services/clientsManagement.service";
import {PaymentRepository} from "./repositories/payment.repository";
import {PaymentService} from "./services/payment.service";
import {BillConfigService} from "./services/billConfig.service";
import {OrderHistoricRepository} from "./repositories/orderHistoric.repository";
import {OrderHistoricService} from "./services/orderHistoric.service";
import {ProductCatalogViewService} from "./services/productCatalogView.service";
import {ProductCatalogViewRepository} from './repositories/productCatalogView.repository';
import {SecurityRolService} from "./services/securityRol.service";
import {SecurityPermissionService} from "./services/securityPermission.service";
import {SecurityRolRepository} from "./repositories/securityRol.repository";
import {SecurityPermissionRepository} from "./repositories/securityPermission.repository";
import {ProductAvailableViewRepository} from "./repositories/productAvailableView.repository";
import {MovementRepository} from "./repositories/movement.repository";
import {MovementService} from "./services/movement.service";
import {AttachmentRepository} from "./repositories/attachment.repository";
import {AttachmentService} from "./services/attachment.service";
import {CachedRepository} from "./repositories/cached.repository";
import {CachedService} from "./services/cached.service";
import {TemplateCatalogRepository} from "./repositories/templateCatalog.repository";
import {TemplateCatalogService} from "./services/templateCatalog.service";
import {DeviceRepository} from "./repositories/device.repository";
import {DeviceService} from "./services/device.service";
import {ItemsRepository} from "./repositories/items.repository";
import {ItemsService} from "./services/items.service";
import {EventItemsRepository} from "./repositories/eventitems.repository";
import {VCardRepository} from "./repositories/vcard.repository";
import {VCardService} from "./services/vcard.service";

export default (app: express.Application): void => {
    const container = createContainer({
        injectionMode: 'CLASSIC'
    });

    container.register({
        // repositories
        userRepository: asClass(UserRepository).scoped(),
        customerRepository: asClass(CustomerRepository).scoped(),
        deliveryLocalityRepository: asClass(DeliveryLocalityRepository).scoped(),
        municipalityRepository: asClass(MunicipalityRepository).scoped(),
        stateRepository: asClass(StateRepository).scoped(),
        sizeRepository: asClass(SizeRepository).scoped(),
        productRepository: asClass(ProductRepository).scoped(),
        fieldOptionRepository: asClass(FieldOptionRepository).scoped(),
        categoryRepository: asClass(CategoryRepository).scoped(),
        productSizeRepository: asClass(ProductSizeRepository).scoped(),
        productImageRepository: asClass(ProductImageRepository).scoped(),
        deliveryMethodRepository: asClass(DeliveryMethodRepository).scoped(),
        orderRepository: asClass(OrderRepository).scoped(),
        orderDetailRepository: asClass(OrderDetailRepository).scoped(),
        orderDeliveryRepository: asClass(OrderDeliveryRepository).scoped(),
        notificationRepository: asClass(NotificationRepository).scoped(),
        templateRepository: asClass(TemplateRepository).scoped(),
        commentRepository: asClass(CommentRepository).scoped(),
        batchRequestRepository:  asClass(BatchRequestRepository).scoped(),
        officeRepository:  asClass(OfficeRepository).scoped(),
        billRepository: asClass(BillRepository).scoped(),
        billConfigRepository: asClass(BillConfigRepository).scoped(),
        billCreditMemoRepository: asClass(BillCreditMemoRepository).scoped(),
        paymentRepository: asClass(PaymentRepository).scoped(),
        orderHistoricRepository: asClass(OrderHistoricRepository).scoped(),
        productCatalogViewRepository: asClass(ProductCatalogViewRepository).scoped(),
        securityRolRepository: asClass(SecurityRolRepository).scoped(),
        securityPermissionRepository: asClass(SecurityPermissionRepository).scoped(),
        productAvailableViewRepository: asClass(ProductAvailableViewRepository).scoped(),
        templateCatalogRepository: asClass(TemplateCatalogRepository).scoped(),
        movementRepository: asClass(MovementRepository).scoped(),
        attachmentRepository: asClass(AttachmentRepository).scoped(),
        cachedRepository: asClass(CachedRepository).scoped(),
        deviceRepository: asClass(DeviceRepository).scoped(),
        itemsRepository: asClass(ItemsRepository).scoped(),
        eventItemRepository: asClass(EventItemsRepository).scoped(),
        vcardRepository: asClass(VCardRepository).scoped(),
        // services
        userService: asClass(UserService).scoped(),
        customerService: asClass(CustomerService).scoped(),
        deliveryLocalityService: asClass(DeliveryLocalityService).scoped(),
        municipalityService: asClass(MunicipalityService).scoped(),
        stateService: asClass(StateService).scoped(),
        sizeService: asClass(SizeService).scoped(),
        productService: asClass(ProductService).scoped(),
        fieldOptionService: asClass(FieldOptionService).scoped(),
        categoryService: asClass(CategoryService).scoped(),
        productSizeService: asClass(ProductSizeService).scoped(),
        productImageService: asClass(ProductImageService).scoped(),
        mediaManagementService: asClass(MediaManagementService).scoped(),
        deliveryMethodService: asClass(DeliveryMethodService).scoped(),
        orderService: asClass(OrderService).scoped(),
        notificationService: asClass(NotificationService).scoped(),
        templateService: asClass(TemplateService).scoped(),
        commentService: asClass(CommentService).scoped(),
        batchRequestService: asClass(BatchRequestService).scoped(),
        officeService: asClass(OfficeService).scoped(),
        orderDeliveryService: asClass(OrderDeliveryService).scoped(),
        billService: asClass(BillService).scoped(),
        clientManagementService: asClass(ClientsManagementService).scoped(),
        paymentService: asClass(PaymentService).scoped(),
        billConfigService: asClass(BillConfigService).scoped(),
        orderHistoricService: asClass(OrderHistoricService).scoped(),
        productCatalogViewService: asClass(ProductCatalogViewService).scoped(),
        securityRolService: asClass(SecurityRolService).scoped(),
        securityPermissionService: asClass(SecurityPermissionService).scoped(),
        templateCatalogService: asClass(TemplateCatalogService).scoped(),
        movementService: asClass(MovementService).scoped(),
        attachmentService: asClass(AttachmentService).scoped(),
        cachedService: asClass(CachedService).scoped(),
        deviceService: asClass(DeviceService).scoped(),
        itemsService: asClass(ItemsService).scoped(),
        vcardService: asClass(VCardService).scoped(),
    });

    app.use(scopePerRequest(container));
};
