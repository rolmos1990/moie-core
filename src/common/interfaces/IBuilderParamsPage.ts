import {OperationQuery} from "../controllers/operation.query";
import {ConditionalQuery} from "../controllers/conditional.query";

export interface IBuilderParamsPage {
    limit: number,
    pageNumber: number,
    operationQuery: OperationQuery,
    hasGroup: boolean,
    queryCondition: ConditionalQuery,
    hasOperation: boolean
};
