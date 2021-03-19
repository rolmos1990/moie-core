import {PageQuery} from "./page.query";
import {IService} from "../interfaces/IService";

export abstract class BaseService<Entity> implements IService {
    constructor(
        private readonly baseRepository: any
    ){}

    public count(pageQuery: PageQuery): Promise<Entity[]> {
        return this.baseRepository.count(pageQuery);
    }

    public sum(pageQuery: PageQuery): Promise<Entity[]> {
        return this.baseRepository.sum(pageQuery);
    }

    public avg(pageQuery: PageQuery): Promise<Entity[]> {
        return this.baseRepository.avg(pageQuery);
    }

    public all(pageQuery: PageQuery): Promise<Entity[]> {
        return this.baseRepository.all(pageQuery);
    }

    public find(id: number, relations = []): Promise<Entity> {
        return this.baseRepository.find(id, relations);
    }

    public async createOrUpdate(item: Object){
        return this.baseRepository.save(item);
    }
}
