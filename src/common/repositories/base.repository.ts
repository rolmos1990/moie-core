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
            const tableName = this.repositoryManager.metadata.tableName;
            let select = "*";
            if(operators.getGroups().length > 0){
                select = operators.getOperator().join(",") + "," + operators.getGroups().join(",");
            } else {
                select = operators.getOperator().join(",");
            }
            const sum = await this.repositoryManager
                .createQueryBuilder(tableName)
                .select(select)
                .where(page.getWhere())
                .groupBy(operators.getGroups().join(","));
            console.log(sum.getQuery());
            return sum.getRawMany();
        }
        else if(operators.isGroup()){
            const tableName = this.repositoryManager.metadata.tableName;
            const sum = await this.repositoryManager
                .createQueryBuilder(tableName)
                .where(page.getWhere())
                .groupBy(operators.getGroups().join(","));
            if(page.getRelations().length > 0){
                page.getRelations().forEach(item => {
                   sum.leftJoinAndSelect( tableName + "." + item, item);
                });
            }
            return sum.getMany();
        }
        else {
            return await this.repositoryManager.find(page.get());
        }
    }

    async find(id: number, relations = []){
        return await this.repositoryManager.findOneOrFail(id, {relations});
    }

    async save(entity: T){
        await this.repositoryManager.save(entity);
    }

};
