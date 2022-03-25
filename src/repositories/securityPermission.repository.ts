import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {SecurityPermission} from "../models/SecurityPermission";

export class SecurityPermissionRepository<T> extends BaseRepository<SecurityPermission>{
    protected readonly repositoryManager : Repository<SecurityPermission>;

    constructor(){
        super();
        this.repositoryManager = getRepository(SecurityPermission);
    }
}
