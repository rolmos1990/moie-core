import {InvalidArgumentException} from "../exceptions";

/**
 * You can get the OperationQuery for Used in a Repository and make the conditionals SUM, AVG and others operators
 * @OperationQuery Class
 */

export class OperationQuery {

    private group: Array<String> = [];
    private operators: Array<any> = [];
    private validOperators = ['SUM','COUNT','AVG'];

    constructor(operation: string | null, group: string | null){
        if(group) {
            this.buildGroupQuery(group);
        }
        if(operation) {
            this.buildOperatorQuery(operation);
        }
    }

    buildGroupQuery(group: string){

        const groupSplit = group.split(",");
        this.group = groupSplit;
    }
    buildOperatorQuery(operation: string){

        let operationSplit = operation.split(",");
        let result: Array<Object> = [];
        if(operationSplit.length > 0){
            let hasError = false;
            let operator = "";
            result = operationSplit.map(item => {
                try {
                    const opValue = item.split("::");
                    if(this.validOperators.includes(opValue[1].toUpperCase())){
                        const operator = opValue[1];
                        let field = opValue[0];
                        field = field.split(/(?=[A-Z])/).join('_').toLowerCase()
                        return { operator: operator.toUpperCase() + "("+field+")" , alias: field};
                    } else {
                        throw new InvalidArgumentException("Operador Invalido");
                    }
                }catch(e){
                    throw new InvalidArgumentException("Operador Invalido");
                }
                return '';
            });
            if(hasError){
                throw new InvalidArgumentException("Invalid Operator" + operator);
            }
        }
        this.operators = result;
    }

    getOperator(){
        return this.operators;
    }

    getGroups(){
        return this.group;
    }

    getGroupsAndCount(){
        return this.group.map(item => {
            return 'COUNT('+item+') AS COUNT';
        });
    }

    isEmpty(){
        if(
            (!this.operators || this.operators.length === 0) &&
            (!this.group || this.group.length === 0)
        ){
            return true;
        }
        return false;
    }

    isGroup()
    {
        return this.group.length > 0;
    }

    isOperator(){
        return this.operators.length > 0;
    }
}
