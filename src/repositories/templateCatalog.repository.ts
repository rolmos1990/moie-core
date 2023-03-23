import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {TemplateCatalog} from "../models/TemplateCatalog";

export class TemplateCatalogRepository<T> extends BaseRepository<TemplateCatalog>{
    protected readonly repositoryManager : Repository<TemplateCatalog>;

    constructor(){
        super();
        this.repositoryManager = getRepository(TemplateCatalog);
    }
}
