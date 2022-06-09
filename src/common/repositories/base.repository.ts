import {EntityTarget, Repository} from "typeorm";
import {PageQuery} from "../controllers/page.query";
import {OperationQuery} from "../controllers/operation.query";
import {ApplicationException, InvalidArgumentException} from "../exceptions";
import {ProductSize} from "../../models/ProductSize";
import {RawSqlResultsToEntityTransformer} from "typeorm/query-builder/transformer/RawSqlResultsToEntityTransformer";
import {RelationIdLoader} from "typeorm/query-builder/relation-id/RelationIdLoader";
import {RelationCountLoader} from "typeorm/query-builder/relation-count/RelationCountLoader";

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

/*            if(operators.getGroups().length > 0){
                select = operators.getOperator().join(",") + "," + operators.getGroups().join(",");
            }*/

            const sum = this.repositoryManager
                .createQueryBuilder(tableName)
                .where(page.getWhere())
                .groupBy(operators.getGroups().map(item => tableName + "." + item).join(","))
                .setLock('pessimistic_write');

            if(page.getRelations().length > 0){
                page.getRelations().forEach(item => {
                    sum.leftJoinAndSelect( tableName + "." + item, item);
                });
            }
            if(operators.getGroups().length > 0){
                sum.addSelect(operators.getOperator().map(item => item.operator + " AS " + tableName + "_" + item.alias).join(","));
                sum.addSelect(operators.getGroups().join(","));
            } else {
                sum.select(this.repositoryManager.metadata.columns.map(item => tableName + "." + item.databaseNameWithoutPrefixes).join(","))
            }

            let query = sum.getQuery();

            // 👇 Here is where you can modify the SQL for the query to suit your requirements
            //query = query.replace(/ WITH \(UPDLOCK, ROWLOCK\) /, ' WITH (UPDLOCK, READPAST) ');

            const rawResults = await sum.getRawMany();

            const queryRunner =  this.repositoryManager.manager.connection.createQueryRunner();

            const relationIdLoader = new RelationIdLoader(
                this.repositoryManager.manager.connection,
                queryRunner,
                sum.expressionMap.relationIdAttributes,
            );

            const relationCountLoader = new RelationCountLoader(
                this.repositoryManager.manager.connection,
                queryRunner,
                sum.expressionMap.relationCountAttributes,
            );

            const rawRelationIdResults = await relationIdLoader.load(rawResults);
            const rawRelationCountResults = await relationCountLoader.load(rawResults);


            const transformer = new RawSqlResultsToEntityTransformer(
                sum.expressionMap,
                this.repositoryManager.manager.connection.driver,
                rawRelationIdResults,
                rawRelationCountResults,
                queryRunner,
            );
            const result = transformer.transform(rawResults, sum.expressionMap.mainAlias);
            return result;
        }
        else if(operators.isGroup()){
            const tableName = this.repositoryManager.metadata.tableName;
            const sum = await this.repositoryManager
                .createQueryBuilder(tableName)
                .where(page.getWhere())
                .groupBy(operators.getGroups().map(item => tableName + "." +item).join(","));
            if(page.getRelations().length > 0){
                page.getRelations().forEach(item => {
                   sum.leftJoinAndSelect( tableName + "." + item, item);
                });
            }
            return sum.getMany();
        }
        else if(page.hasSubQuery()){

            const tableName = this.repositoryManager.metadata.tableName;

            //const subQuery = ['orderDelivery.tracking = :tracking', { tracking: 123456 }];

            const subQueries = page.getWhereSubQuery();
            const where = page.getWhere();
            //{ orderDelivery: tableName + '.orderDelivery' }
            return await this.repositoryManager.find({
                ...page.get(),
                join: { alias: tableName, innerJoin: page.getSubQueryInnerJoin(tableName) },
                where: qb => {
                    qb.where(where);
                    subQueries.forEach(item => {
                       qb.andWhere(item.query, item.search); // Filter related field

                    });
                    //qb.andWhere();
                    //.andWhere(page.getWhereSubQuery() 'orderDelivery.tracking = :tracking', { tracking: 123456 }); // Filter related field
                }
            });
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

    async findByObjectWithLimit(field: Object, relations = [], limit){
        return await this.repositoryManager.find({
            where: field,
            relations,
            take:limit
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
            throw new InvalidArgumentException("No hemos encontrado un registro para esta solicitud");
        }
        return data;
    }

    async update(id, options){
        return await this.repositoryManager.update(id, options);
    }

    async save(entity: T){
        return await this.repositoryManager.save(entity);
    }

    async saveMany(entities: Array<T>){
        return await this.repositoryManager.save(entities, {chunk: 1000, transaction: true});
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

    public createQueryBuilder(name){
        return this.repositoryManager.createQueryBuilder(name);
    }

};
