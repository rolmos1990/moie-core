import {BaseService} from "../common/controllers/base.service";
import {TemplateCatalog} from "../models/TemplateCatalog";
import {TemplateCatalogRepository} from "../repositories/templateCatalog.repository";

export class TemplateCatalogService extends BaseService<TemplateCatalog> {
    constructor(
        private readonly templateCatalogRepository: TemplateCatalogRepository<TemplateCatalog>
    ){
        super(templateCatalogRepository);
    }
}
