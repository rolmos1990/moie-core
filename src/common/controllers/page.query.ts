import {ConditionalQuery} from "./conditional.query";
import {OrderConditional} from "../enum/order.conditional";
import {OperationQuery} from "./operation.query";
import {ArrayToObject} from "../helper/helpers";

/**
 * You can use the default Limit and Default Offset for change in the Global Paginator Used.
 */

const DEFAULT_LIMIT = 250;
const DEFAULT_OFFSET = 0;

/**
 * You can get the paginator for your repository in this class
 * @PageQuery Class
 */

export class PageQuery {

    private readonly where:any = [];
    private readonly whereSubQuery: any = [];
    private readonly select: string | Array<string> | null;
    private readonly limit:number = DEFAULT_LIMIT;
    private readonly offset:number = DEFAULT_OFFSET;

    private orders:Array<Object> = [];

    private condition:Object = {};

    private operators: OperationQuery | null = null;

    private relations:Array<string> = [];

    private group: Array<string> = [];

    /**
     * Receive the paginator limit, offset, ConditionalQuery (where), and fields (select)
     * for build the Paginator
     * @constructor
     */

    constructor(
        limit:number = DEFAULT_LIMIT,
        offset:number = DEFAULT_OFFSET,
        where: ConditionalQuery[] | ConditionalQuery | null = null,
        operation: OperationQuery | null = null,
        field: string | Array<string> | null = null){

        if(operation instanceof OperationQuery){
            this.operators = operation;
        }

        if(where instanceof ConditionalQuery) {
            this.where = where.get();
            this.whereSubQuery = where.getSubQuery();
        }
        else if(where instanceof Array){
            where.forEach(condition =>{
                this.where.push(condition);
            });
        }
        else{
            this.where = new ConditionalQuery();
        }

        this.select = field;
        this.limit = limit;
        this.offset = offset;
    }

    hasSubQuery() {
        return this.whereSubQuery && this.whereSubQuery.length > 0;
    }

    /**
     * You can add Specific group for the result
     * @addGroup
     */

    addGroup(field: string){
        this.group.push(field);
    }

    /**
     * You can return the groups
     * @getGroup
     * return String
     */
    getGroups(){
        return this.getOperation().getGroups();
    }

    /**
     * You can specific an order by default in your pagination (many orders are allowed)
     * @addOrder
     */

    addOrder(field: string, value: OrderConditional){
        if(!this.orders.includes({field,value})) {
            this.orders.push({field, value});
        }
    }

    /**
     * You can specific an order by default in your pagination (many orders are allowed)
     * @getOrder
     */

    getOrder(){
        if(!(this.orders.length > 0)){
            return [];
        }
        const object = ArrayToObject(this.orders, 'field','value');
        console.log("getOrder:: ", object);
        return object;
    }

    /**
     * You can specific an order by default in your pagination (many orders are allowed)
     * @hasOrder
     */

    hasOrder(){
        return this.orders.length > 0;
    }

    /**
     * Return the select statement
     * @get
     */
    getSelect(){
        if(Array.isArray(this.select)){
            return this.select.join(",");
        } else {
            return this.select || "*";
        }
    }

    /**
     * Return the where query
     * @get
     */
    getWhere(){
        return this.where;
    }

    /**
     * Return the where query
     * @get
     */
    getWhereSubQuery(){
        return this.whereSubQuery || [];
    }

    getSubQueryInnerJoin(alias){

        //{ orderDelivery: tableName + '.orderDelivery' }
        const subQueryInnerJoin = this.getWhereSubQuery().map(item => {
            //conditions.addSub(field[0] + " = :" + subfieldName, {[subfieldName] : subfieldValue });
            const name = item.query.split(".");
            return {[name[0]] : alias + '.' + name[0]};
        });

        return subQueryInnerJoin.reduce((result, item, index, array) => {
            const key = Object.keys(item);
            result[key[0]] = item[key[0]];
            return result;
        }, {});
    }

    /**
     * Return the limit for the statement
     * @get
     */
    getTake(){
        return this.limit;
    }

    /**
     * Return the offset for the statement
     * @get
     */
    getSkip(){
        return this.offset;
    }

    /**
     * Return the OperationQuery in the Page
     * @get
     */
    getOperation() : OperationQuery{
        if(this.operators){
            return this.operators;
        } else {
            return new OperationQuery(null,null);
        }
    }

    /**
     * Return the OperationQuery in the Page
     * @get
     */
    hasOperation() : boolean{
        return this.operators !== null;
    }

    /**
     * Add Relations for Specific Paginator
     * @get
     */
    setRelations(relations: Array<string>){
        this.relations = relations;
    }

    /**
     * Get Relations for Specific Paginator
     * @get
     */
    getRelations(): Array<string>{
        return this.relations;
    }

    /**
     * Add Relations for Specific Paginator if not exists
     * @void
     */
    addRelation(relation: string){
        if(!this.relations.includes(relation)) {
            this.relations.push(relation);
        }
    }



    /**
     * Return the build PageQuery for use in your repository
     * @get
     */

    get(){

        Reflect.set(this.condition, 'where', this.where);
        Reflect.set(this.condition,'select', this.select);
        Reflect.set(this.condition,'take', this.limit);
        Reflect.set(this.condition,'skip', this.offset);
        Reflect.set(this.condition, 'group', this.getGroups());
        if(this.relations.length > 0) {
            Reflect.set(this.condition, 'relations', this.getRelations());
        }
        if(this.hasOrder()){
            Reflect.set(this.condition, 'order', this.getOrder());
        }

        return this.condition;
    }

};
