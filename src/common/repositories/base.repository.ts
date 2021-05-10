import {EntityTarget, Repository} from "typeorm";
import {PageQuery} from "../controllers/page.query";
import {OperationQuery} from "../controllers/operation.query";
import {ApplicationException, InvalidArgumentException} from "../exceptions";
import {ProductSize} from "../../models/ProductSize";

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

    async findBy(field: string, value: any, relations = []){
        return await this.repositoryManager.find({
            where: {
                [field]: value
            },
            relations
        });
    }

    async findByObject(field: Object, relations = []){
        return await this.repositoryManager.find({
            where: field,
            relations
        });
    }

    async findOneByObject(field: Object, relations = []){
        try {
            const item = await this.repositoryManager.find({
                where: field,
                relations
            });
            return item[0];
        }catch(e){
            throw new InvalidArgumentException("No se ha encontrado item requerido");
        }
    }

    async find(id: number, relations = []){
        const data = await this.repositoryManager.findOne(id, {relations});
        if(!data){
            throw new InvalidArgumentException("No se ha encontrado un registro asociado");
        }
        return data;
    }

    async save(entity: T){
        return await this.repositoryManager.save(entity);
    }

    async delete(id: T){
        await this.repositoryManager.delete(id);
    }

    /** options: {firstName: '', lastName: ''} -- filter where increment */
    async increment(entity: EntityTarget<ProductSize>, options, columnToIncrement, valueToIncrement){
        await this.repositoryManager.manager.increment(entity,options,columnToIncrement,valueToIncrement);
    }

    /** options: {firstName: '', lastName: ''} -- filter where decrement */
    async decrement(entity: EntityTarget<ProductSize>, options, columnToDecrement, valueToDecrement){
        await this.repositoryManager.manager.decrement(entity,options,columnToDecrement,valueToDecrement);
    }

};
