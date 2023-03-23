import {BaseService} from "../common/controllers/base.service";
import {Category} from "../models/Category";
import {CategoryRepository} from "../repositories/category.repository";
import {MediaManagementService} from "./mediaManagement.service";
import {getRepository} from "typeorm";

export class CategoryService extends BaseService<Category> {
    constructor(
        private readonly categoryRepository: CategoryRepository<Category>,
        private readonly mediaManagementService: MediaManagementService
    ){
        super(categoryRepository);
    }


    async updateImage(category, fileBinary, _type){
        try {
            if(_type == 'banner') {
                const folder = "categories/";
                const _filename = "category_banner_" + category.id;
                category.filenameBanner = _filename + ".jpg";
                await this.mediaManagementService.addImageFromBinary(folder, _filename, fileBinary);
                await this.categoryRepository.save(category);
            } else if(_type == 'catalog') {
                const folder = "categories/";
                const _filename = "category_catalog_" + category.id;
                category.filenameCatalog = _filename + ".jpg";
                await this.mediaManagementService.addImageFromBinary(folder, _filename, fileBinary);
                await this.categoryRepository.save(category);
            } else {
                const folder = "categories/";
                const _filename = "category_" + category.id;
                category.filename = _filename + ".jpg";
                await this.mediaManagementService.addImageFromBinary(folder, _filename, fileBinary);
                await this.categoryRepository.save(category);
            }
        }catch(e){
            console.log("error imagen", e.message);
            throw Error("No se pudo guardar la imagen");
        }
    }

    async resetOrderCategory(categoryId){
        await this.categoryRepository.resetOrderCategory(categoryId);
    }

    async getPiecesUnpublished(categoryId){
        return await this.categoryRepository.getPiecesUnblishedByCategory(categoryId);
    }

}
