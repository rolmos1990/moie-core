import {BaseService} from "../common/controllers/base.service";
import {Client} from "../models/Client";
import {ClientRepository} from "../repositories/client.repository";

export class ClientService extends BaseService<Client> {
    constructor(
        private readonly clientRepository: ClientRepository<Client>
    ){
        super(clientRepository);
    }
}
