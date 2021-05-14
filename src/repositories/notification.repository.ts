import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {Notification} from "../models/Notification";

export class NotificationRepository<T> extends BaseRepository<Notification>{
    protected readonly repositoryManager : Repository<Notification>;

    constructor(){
        super();
        this.repositoryManager = getRepository(Notification);
    }
}
