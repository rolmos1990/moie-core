import {BaseService} from "../common/controllers/base.service";
import {Category} from "../models/Category";
import {CategoryRepository} from "../repositories/category.repository";
import {MediaManagementService} from "./mediaManagement.service";

export class CategoryService extends BaseService<Category> {
    constructor(
        private readonly categoryRepository: CategoryRepository<Category>,
        private readonly mediaManagementService: MediaManagementService
    ){
        super(categoryRepository);
    }


    async updateImage(category, fileBinary){
        try {
            const folder = "categories";
            const _filename = "category_" + category.id + ".jpg";
            category.filename = _filename;
            await this.mediaManagementService.addImageFromBinary(folder, _filename, fileBinary);
            await this.categoryRepository.save(category);
        }catch(e){
            console.log("error imagen", e.message);
            throw Error("No se pudo guardar la imagen");
        }
    }
}
