import {BaseService} from "../common/controllers/base.service";
import {SecurityRol} from "../models/securityRol";
import {SecurityRolRepository} from "../repositories/securityRol.repository";

export class SecurityRolService extends BaseService<SecurityRol> {
    constructor(
        private readonly securityRolRepository: SecurityRolRepository<SecurityRol>
    ){
        super(securityRolRepository);
    }
}
