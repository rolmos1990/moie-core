import {CategoryService} from "../services/category.service";
import {MigrationManager} from "../common/migrationUtility/migrationManager";
import {GET, POST, route} from "awilix-express";
import {Request, Response} from "express";
import {ProductService} from "../services/product.service";
import {SizeService} from "../services/size.service";
import {ProductSizeService} from "../services/productSize.service";
import {DeliveryLocalityService} from "../services/deliveryLocality.service";
import {StateService} from "../services/state.service";
import {MunicipalityService} from "../services/municipality.service";
import {CustomerService} from "../services/client.service";
import {ProductImageService} from "../services/productImage.service";
import {PaymentService} from "../services/payment.service";
import {OfficeService} from "../services/office.service";
import {UserService} from "../services/user.service";
import {OrderService} from "../services/order.service";
import {CommentCustomerService} from "../services/commentCustomer.service";
import {CommentOrderService} from "../services/commentOrder.service";
import {OrderDetailService} from "../services/orderDetail.service";
import {OrderHistoricService} from "../services/orderHistoric.service";
import {BillConfigService} from "../services/billConfig.service";
import {BillService} from "../services/bill.service";
import {BillCreditMemoService} from "../services/billCreditMemo.service";
import {CommentPostSaleService} from "../services/commentPostSale.service";
import {MovementService} from "../services/movement.service";
import {AttachmentService} from "../services/attachment.service";

@route('/migration')
export class MigrationController {
    constructor(
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService,
        private readonly productImageService: ProductImageService,
        private readonly sizeService: SizeService,
        private readonly productSizeService: ProductSizeService,
        private readonly deliveryLocalityService: DeliveryLocalityService,
        private readonly stateService: StateService,
        private readonly municipalityService: MunicipalityService,
        private readonly customerService: CustomerService,
        private readonly userService: UserService,
        private readonly officeService: OfficeService,
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService,
        private readonly commentCustomerService: CommentCustomerService,
        private readonly commentOrderService: CommentOrderService,
        private readonly commentPostSaleService: CommentPostSaleService,
        private readonly orderDetailService: OrderDetailService,
        private readonly orderHistoricService: OrderHistoricService,
        private readonly billConfigService: BillConfigService,
        private readonly billService: BillService,
        private readonly billCreditMemoService: BillCreditMemoService,
        private readonly movementService: MovementService,
        private readonly attachmentService: AttachmentService,
    ){
    };
    @GET()
    @route("/")
    public index(req: Request, res: Response): void {
        this.runMigration();
        res.json({success:true});
    }

    async runMigration(){
        console.log("#################################################################");
        console.log("...........         MOIE MIGRACIÓN V2.0  .................");
        console.log("...........    INICIANDO PROCESO DE MIGRACIÓN   .................");
        console.log("#################################################################");

        const dateStart = new Date();

        console.log("##########################");
        console.log("1. Migrando Categorias");
        const migrationManagerCategory = new MigrationManager(this.categoryService);
        await migrationManagerCategory.run();

        console.log("########################");
        console.log("2. Migrando Tallas");
        const migrationManagerSize = new MigrationManager(this.sizeService);
        await migrationManagerSize.run();

        console.log("########################");
        console.log("3. Migrando Productos");
        const migrationManagerProduct = new MigrationManager(this.productService);
        await migrationManagerProduct.run();

        console.log("########################");
        console.log("4. Migrando Existencia (ProductSize)");
        const migrationManagerProductSize = new MigrationManager(this.productSizeService);
        await migrationManagerProductSize.run();

        console.log("########################");
        console.log("3. Migrando Imagenes de Productos");
        const migrationManagerImages = new MigrationManager(this.productImageService);
        await migrationManagerImages.run(false);

        console.log("########################");
        console.log("5. Migrando Localidades (Envios)");
        const migrationManagerDeliveryLocality = new MigrationManager(this.deliveryLocalityService);
        await migrationManagerDeliveryLocality.run();

        console.log("########################");
        console.log("6. Migrando States (Estados)");
        const migrationManagerState = new MigrationManager(this.stateService);
        await migrationManagerState.run();

        console.log("########################");
        console.log("7. Migrando Municipios (Municipios)");
        const migrationMunicipality = new MigrationManager(this.municipalityService);
        await migrationMunicipality.run();

        console.log("########################");
        console.log("8. Migrando Clientes");
        const migrationCustomer = new MigrationManager(this.customerService);
        await migrationCustomer.run();

        console.log("########################");
        console.log("9. Migrando Usuarios");
        const migrationUser = new MigrationManager(this.userService);
        await migrationUser.run();

        console.log("########################");
        console.log("10. Migrando Despachos");
        const migrationOffice = new MigrationManager(this.officeService);
        await migrationOffice.run();

        console.log("########################");
        console.log("13. Migrando Ordenes");
        const migrationOrder = new MigrationManager(this.orderService);
        await migrationOrder.run();

        console.log("########################");
        console.log("12. Migrando Pagos");
        const migrationPayment = new MigrationManager(this.paymentService);
        await migrationPayment.run();

        console.log("########################");
        console.log("13. Migrando Comentarios de Clientes");
        const migrationCommentCustomer = new MigrationManager(this.commentCustomerService);
        await migrationCommentCustomer.run();

        console.log("########################");
        console.log("14. Migrando Comentarios de Ordenes");
        const migrationCommentOrder = new MigrationManager(this.commentOrderService);
        await migrationCommentOrder.run();

        console.log("########################");
        console.log("15. Migrando Comentarios de PostVentas");
        const migrationCommentPostSale = new MigrationManager(this.commentPostSaleService);
        await migrationCommentPostSale.run();

        console.log("########################");
        console.log("16. Migrando Detalles de Ordenes");
        const migrationOrderDetail = new MigrationManager(this.orderDetailService);
        await migrationOrderDetail.run();

        console.log("########################");
        console.log("17. Migrando Historico de Ordenes");
        const migrationOrderHistoric = new MigrationManager(this.orderHistoricService);
        await migrationOrderHistoric.run();

        console.log("########################");
        console.log("18. Migrando Configuracion de Facturacion");
        const migrationBillConfig = new MigrationManager(this.billConfigService);
        await migrationBillConfig.run();

        console.log("########################");
        console.log("19. Migrando Facturas");
        const migrationBill = new MigrationManager(this.billService);
        await migrationBill.run();

        console.log("########################");
        console.log("20. Migrando Facturas");
        const migrationBillCreditMemo = new MigrationManager(this.billCreditMemoService);
        await migrationBillCreditMemo.run();

        console.log("########################");
        console.log("21. Migrando Billetera");
        const migrationWalletCreditMemo = new MigrationManager(this.movementService);
        await migrationWalletCreditMemo.run();

        console.log("########################");
        console.log("22. Migrando Adjuntos");
        const migrationAttachmentCreditMemo = new MigrationManager(this.attachmentService);
        await migrationAttachmentCreditMemo.run();

        const dateEnd = new Date();

        const diff = Math.abs(dateStart.getTime() - dateEnd.getTime());
        const seconds = Math.floor((diff/ 1000));

        const minutes = Math.floor(seconds / 60);
        const _seconds = Math.floor(seconds % 60);

        console.log("## FINALIZADO ####")
        console.log(`Duracion Minutos - ${minutes} : ${_seconds}`);

        return;
    }
}
