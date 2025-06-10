import {PageQuery} from "./page.query";
import {IService} from "../interfaces/IService";

export abstract class BaseService<Entity> implements IService {
    constructor(
        private readonly baseRepository: any
    ){}

    public count(pageQuery: PageQuery): Promise<number> {
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

    public find(id: number|string, relations = []): Promise<Entity> {
        return this.baseRepository.find(id, relations);
    }

    public findByObject(object: Object, relations = []): Promise<Entity[]> {
        return this.baseRepository.findByObject(object, relations);
    }

    public findByObjectWithLimit(object: Object, relations = [], limit): Promise<Entity[]> {
        return this.baseRepository.findByObjectWithLimit(object, relations, limit);
    }

    public findByWithPage(object: Object, relations = [], skip = 0, limit = 0): Promise<Entity[]> {
        return this.baseRepository.findByObjectWithSkipAndLimit(object, relations, skip, limit);
    }

    public async delete(id: number): Promise<Entity> {
        return await this.baseRepository.delete(id);
    }

    public async createOrUpdate(item: Object, options = {}){
        return await this.baseRepository.save(item, options);
    }

    public async createOrUpdateMany(item: Object[]){
        return await this.baseRepository.save(item, { chunk: 1000 });
    }

    public async clear(){
        return await this.baseRepository.clear();
    }
}
