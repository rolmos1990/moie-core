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
import {ClientService} from "../services/client.service";
import {ProductImageService} from "../services/productImage.service";
import {TemporalAddressService} from "../services/temporalAddress.service";

@route('/migration')
export class MigrationController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly productService: ProductService,
        private readonly productImageService: ProductImageService,
        private readonly sizeService: SizeService,
        private readonly productSizeService: ProductSizeService,
        private readonly deliveryLocalityService: DeliveryLocalityService,
        private readonly stateService: StateService,
        private readonly municipalityService: MunicipalityService,
        private readonly clientService: ClientService,
        private readonly temporalAddressService: TemporalAddressService
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
        const migrationClient = new MigrationManager(this.clientService);
        await migrationClient.run();

        console.log("########################");
        console.log("8. Migrando Direcciones temporales Clientes");
        const migrationTemporalAddress = new MigrationManager(this.temporalAddressService);
        await migrationTemporalAddress.run();

        return;
    }
}
