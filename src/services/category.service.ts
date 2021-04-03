import {BaseService} from "../common/controllers/base.service";
import {Category} from "../models/Category";
import {Category as CategoryWeb} from "../models_web/Category";
import {getRepository} from "typeorm";

export class CategoryService extends BaseService<Category> {

    private readonly newRepository;
    private readonly storeRepository;
    //private readonly originalRepository;
    constructor(){
        super();
        this.newRepository = getRepository(Category);
        this.storeRepository = getRepository(CategoryWeb);
    }

    /**
     * Levantar migración de datos
     */
    async up(limit, skip = 0){
        await this.newRepository.query("SET FOREIGN_KEY_CHECKS=0;");
        const items : CategoryWeb[] = await this.storeRepository.createQueryBuilder("c")
            .orderBy("c.id", "ASC")
            .skip(skip)
            .take(limit)
            .getMany();

        const categories: Category[] = [];

        items.forEach(item => {
            const category = new Category();
            category.id = item.id;
            category.name = item.name;
            category.createdAt = item.createdAt;
            category.updatedAt = new Date();
            category.status = true;
            categories.push(category);
        });
        const saved = await this.newRepository.save(categories, { chunk: limit });
        this.printResult(saved, items);
    }

    /**
     * En caso de Falla bajar la migración realizada (Borra todo el progreso generado en esta tabla)
     */
    async down(){
        try {
            await this.newRepository.query(`DELETE FROM Category`);
            await this.newRepository.query(`ALTER TABLE Category AUTO_INCREMENT = 1`);

        }catch(e){
            this.printError();
        }
    }

    /**
     * Cantidad previa para evaluar si finalizo con exito
     */
    async counts(){
        const {count} = await this.storeRepository.createQueryBuilder("p")
            .select("COUNT(p.id)", "count").getRawOne();
        return count;
    }

    /**
     * Cantidad nueva para evaluar si finalizo con exito
     */
    async countsNew(){
        const {count} = await this.newRepository.createQueryBuilder("p")
            .select("COUNT(p.id)", "count").getRawOne();
        return count;
    }

    processName() {
        return CategoryService.name
    }
}
