import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {SecurityRol} from "../models/SecurityRol";

export class SecurityRolRepository<T> extends BaseRepository<SecurityRol>{
    protected readonly repositoryManager : Repository<SecurityRol>;

    constructor(){
        super();
        this.repositoryManager = getRepository(SecurityRol);
    }
}
