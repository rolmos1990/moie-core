import {BaseService} from "../common/controllers/base.service";
import {Cached} from "../models/Cached";
import {CachedRepository} from "../repositories/cached.repository";

export class CachedService extends BaseService<Cached> {
    constructor(
        private readonly cachedRepository: CachedRepository<Cached>
    ){
        super(cachedRepository);
    }
}
