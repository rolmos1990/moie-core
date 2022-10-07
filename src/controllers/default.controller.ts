import {Request, Response} from 'express';
import {route, GET} from 'awilix-express';
import {CustomerService} from "../services/customer.service";
import {MediaManagementService} from "../services/mediaManagement.service";

@route('/default')
export class DefaultController {
    constructor(
        private readonly mediaManagementService: MediaManagementService
    ){
    };
    @GET()
    public async index(req: Request, res: Response) {
        //await this.mediaManagementService.createHTML();
        res.send("Running...");
    }
}
