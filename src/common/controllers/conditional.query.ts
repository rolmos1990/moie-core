import {Operator} from "../enum/operators";
import {Equal, In, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not, Between} from "typeorm";
import {ConditionalException} from "../exceptions";

/**
 * You can get the ConditionalQueryParams for Used in a Repository
 * @ConditionalQuery Class
 */

export class ConditionalQuery {

    private condition: Object = {};

    /**
     * Static Use - Convert your request params in ConditionalQuery Class
     * You can get your own ConditionalQuery Class Format
     * @ConvertIntoConditionalParams
     */
    static ConvertIntoConditionalParams(conditionalParams: string | null) : ConditionalQuery{
        try {

            const conditions = new ConditionalQuery;

            if (!conditionalParams || conditionalParams == undefined) {
                return conditions;
            }

            const paramsQuery = unescape(conditionalParams).split("|");

            if (paramsQuery.length <= 0) {
                return conditions;
            }

            paramsQuery.forEach(query => {
                let field;
                if (query.includes("$eq")) {
                    //compare is equal
                    field = query.split("$eq");
                    conditions.add(field[0], Operator.EQUAL, field[1]);
                } else if (query.includes("$nnull")) {
                    //compare is not null
                    field = query.split("$nnull");
                    conditions.add(field[0], Operator.IS_NOT_NULL, null);
                } else if (query.includes("$null")) {
                    //compare is null
                    field = query.split("$null");
                    conditions.add(field[0], Operator.IS_NULL, null);
                } else if (query.includes("$true")) {
                    //compare is true
                    field = query.split("$true");
                    conditions.add(field[0], Operator.EQUAL, true);
                } else if (query.includes("$false")) {
                    //compare is false
                    field = query.split("$false");
                    conditions.add(field[0], Operator.EQUAL, false);
                } else if (query.includes("$nempty")) {
                    //compare is not empty
                    field = query.split("$nempty");
                    conditions.add(field[0], Operator.IS_NOT, "");
                } else if (query.includes("$empty")) {
                    //compare is empty
                    field = query.split("$empty");
                    conditions.add(field[0], Operator.EQUAL, "");
                } else if (query.includes("$nlk")) {
                    //compare not like
                    field = query.split("$nlk");
                    conditions.add(field[0], Operator.NOT_LIKE, "%" + field[1] + "%");
                } else if (query.includes("$lk")) {
                    //compare like
                    field = query.split("$lk");
                    conditions.add(field[0], Operator.LIKE, "%" + field[1] + "%");

                } else if (query.includes("$nbt")) {
                    //compare not between
                    field = query.split("$nbt")
                    const subField = field[1].split("::");
                    conditions.add(field[0], Operator.NOT_BETWEEN, subField[0], subField[1]);
                } else if (query.includes("$bt")) {
                    field = query.split("$bt")
                    const subField = field[1].split("::");
                    conditions.add(field[0], Operator.BETWEEN, subField[0], subField[1]);
                } else if (query.includes("$lte")) {
                    //compare less or equal than
                    field = query.split("$lte");
                    conditions.add(field[0], Operator.LESS_OR_EQUAL_THAN, field[1]);
                } else if (query.includes("$lt")) {
                    //compare less than
                    field = query.split("$lt");
                    conditions.add(field[0], Operator.LESS_THAN, field[1]);

                } else if (query.includes("$gte")) {
                    //compare greater or equal than
                    field = query.split("$gte");
                    conditions.add(field[0], Operator.GREATHER_OR_EQUAL_THAN, field[1]);

                } else if (query.includes("$gt")) {
                    //compare greater than
                    field = query.split("$gt");
                    conditions.add(field[0], Operator.GREATER_THAN, field[1]);
                } else if (query.includes("$nin")) {
                    //compare (not in)
                    field = query.split("$nin");

                    const subQuery = field[1].split("::");
                    if (!(subQuery.length > 0)) {
                        throw new ConditionalException;
                    }
                    conditions.add(field[0], Operator.NOT_IN, subQuery);
                } else if (query.includes("$in")) {
                    //compare (in)
                    field = query.split("$in");

                    const subQuery = field[1].split("::");
                    if (!(subQuery.length > 0)) {
                        throw new ConditionalException;
                    }
                    conditions.add(field[0], Operator.IN, subQuery);

                } else if (query.includes("$ne")) {
                    //compare not equal
                    field = query.split("$ne");
                    conditions.add(field[0], Operator.NOT_EQUAL, field[1]);
                }  else if(query.includes("::")){
                    //compare is equal
                    field = query.split("::");
                    conditions.add(field[0], Operator.EQUAL, field[1]);
                }
                else{
                    throw new ConditionalException;
                }
            });
            return conditions;
        }catch(e){
            throw new ConditionalException(e);
        }
    }

    /**
     * Add new condition in your ConditionalQuery
     * @add
     */

    add(field: string, operator: Operator, value: any, moreValues: any = null){

        const _value = Reflect.get(this.condition, field);
        if(Reflect.get(this.condition, field)){
            value = _value;
        }

        switch(operator){
            case Operator.EQUAL:
                value = Equal(value);
            break;
            case Operator.NOT_EQUAL:
                value = Not(Equal(value));
            break;
            case Operator.GREATER_THAN:
                value = MoreThan(value);
            break;
            case Operator.GREATHER_OR_EQUAL_THAN:
                value = MoreThanOrEqual(value);
            break;
            case Operator.LESS_THAN:
                value = LessThan(value);
            break;
            case Operator.LESS_OR_EQUAL_THAN:
                value = LessThanOrEqual(value);
            break;
            case Operator.LIKE:
                value = Like(value);
            break;
            case Operator.NOT_LIKE:
                value = Not(Like(value));
            break;
            case Operator.IS_NOT:
                value = Not(value);
            break;
            case Operator.IS_NULL:
                value =  IsNull();
            break;
            case Operator.IS_NOT_NULL:
                value = Not(IsNull());
            break;
            case Operator.IN:
                value = In(value)
            break;
            case Operator.NOT_IN:
                value = Not(In(value));
            break;
            case Operator.BETWEEN:
                value = Between(value, moreValues);
            break;
            case Operator.NOT_BETWEEN:
                value = Not(Between(value, moreValues));
            break;
        }

        Reflect.set(this.condition, field, value);

    }

    /**
     * Return the Object condition
     * @get
     */

    get(){
        return this.condition;
    }

};
