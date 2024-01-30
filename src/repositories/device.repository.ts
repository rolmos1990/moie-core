import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Device} from "../models/Device";

export class DeviceRepository<T> extends BaseRepository<Device>{
    protected readonly repositoryManager : Repository<Device>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Device);
    }
}
