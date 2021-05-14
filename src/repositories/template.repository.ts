import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Template} from "../models/Template";

export class TemplateRepository<T> extends BaseRepository<Template>{
    protected readonly repositoryManager : Repository<Template>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Template);
    }
}
