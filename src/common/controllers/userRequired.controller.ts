import {BaseController} from "./base.controller";
import {GET} from "awilix-express";
import {Request, Response} from "express";
import {ConditionalQuery} from "./conditional.query";
import {OperationQuery} from "./operation.query";
import {PageQuery} from "./page.query";
import {OrderConditional} from "../enum/order.conditional";
import {isEmpty} from "../helper/helpers";
import {PageDTO} from "../../controllers/parsers/page";
import {Operator} from "../enum/operators";
import {IService} from "../interfaces/IService";
import {UserService} from "../../services/user.service";

export abstract class UserRequiredController<Parse> extends BaseController<Parse> {
    constructor(
        protected readonly userService: UserService,
        protected readonly service: IService,
        protected readonly serviceAux?: IService,
    ){
        super(service, serviceAux);
    };
    @GET()
    public async index(req: Request, res: Response) {
        try {
            const query = req.query;
            const conditional = query.conditional ? query.conditional + "" : null;
            const offset = query.offset ? query.offset + "" : "0";
            const pageNumber = parseInt(offset);
            const limit = query.limit ? parseInt(query.limit + "") : 100;
            const operation = query.operation ? query.operation + "" : null;
            const group = query.group ? query.group + "" : null;

            const queryCondition = ConditionalQuery.ConvertIntoConditionalParams(conditional);
            const operationQuery = new OperationQuery(operation, group);
            let page = new PageQuery(limit,pageNumber,queryCondition, operationQuery);

            if(!query.operation){
                page.addOrder('id', OrderConditional.DESC);
            }
            const countRegisters = await this.service.count(page);

            /** Relations by Default */
            if(this.getDefaultRelations(false)){
                page.setRelations(this.getDefaultRelations(false));
            }

            /** Relations with groups */
            if(this.getGroupRelations() && !isEmpty(group)){
                page.setRelations(this.getGroupRelations());
            }

            /** Force to relation with the user */
            page.addRelation("user");
            const user = await this.userService.find(req["user"]);
            queryCondition.add("user", Operator.EQUAL, user.id);

            let items: Array<Object> = await this.service.all(page);

            if((items && items.length) > 0){
                items = await Promise.all(items.map(async item => await this.getParseGET(<Parse> item, false)));
            }

            const response = PageDTO(items || [], countRegisters, pageNumber + 1, limit);
            res.json(response);
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }
}
