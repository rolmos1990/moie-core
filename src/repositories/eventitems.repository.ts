import BaseRepository from "../common/repositories/base.repository";
import {getRepository, Repository} from "typeorm";
import {EventItems} from "../models/EventItems";

export class EventItemsRepository<T> extends BaseRepository<EventItems>{
    protected readonly repositoryManager : Repository<EventItems>;

    constructor(){
        super();
        this.repositoryManager = getRepository(EventItems);
    }
}
