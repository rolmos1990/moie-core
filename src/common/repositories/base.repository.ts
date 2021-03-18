import {Repository} from "typeorm";
import {PageQuery} from "../controllers/page.query";
import {OperationQuery} from "../controllers/operation.query";

export default abstract class BaseRepository<T> {
    protected readonly repositoryManager : Repository<T>;

    async count(page: PageQuery = new PageQuery()){
        return await this.repositoryManager.count(page.get());
    }

    async all(page: PageQuery = new PageQuery()){
        const operators : OperationQuery = page.getOperation();
        if(operators.isOperator()) {
            const sum = await this.repositoryManager
                .createQueryBuilder(this.repositoryManager.metadata.tableName)
                .select(operators.getOperator().join(",") + "," + operators.getGroups().join(","))
                .where(page.getWhere())
                .groupBy(operators.getGroups().join(","))
                .getRawMany();
            return sum;
        }
        else if(operators.isGroup()){
            const sum = await this.repositoryManager
                .createQueryBuilder(this.repositoryManager.metadata.tableName)
                .where(page.getWhere())
                .groupBy(operators.getGroups().join(","))
                .getMany()
            return sum;
        }
        else {
            return await this.repositoryManager.find(page.get());
        }
    }

    async find(id: number){
        return await this.repositoryManager.findOneOrFail(id);
    }

    async save(entity: T){
        await this.repositoryManager.save(entity);
    }

};
