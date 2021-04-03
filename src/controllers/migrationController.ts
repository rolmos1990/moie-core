import {CategoryService} from "../services/category.service";
import {MigrationManager} from "../common/migrationUtility/migrationManager";
import {GET, POST, route} from "awilix-express";
import {Request, Response} from "express";
import {ProductService} from "../services/product.service";

@route('/migration')
export class MigrationController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly productService: ProductService
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
        console.log("2. Migrando Productos");
        const migrationManagerProduct = new MigrationManager(this.productService);
        await migrationManagerProduct.run();

        return;
    }
}
