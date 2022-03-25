import {BaseService} from "../common/controllers/base.service";
import {SecurityPermission} from "../models/SecurityPermission";
import {SecurityPermissionRepository} from "../repositories/securityPermission.repository";

export class SecurityPermissionService extends BaseService<SecurityPermission> {
    constructor(
        private readonly securityPermissionRepository: SecurityPermissionRepository<SecurityPermission>
    ){
        super(securityPermissionRepository);
    }
}
