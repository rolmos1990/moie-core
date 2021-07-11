import {BaseService} from "../common/controllers/base.service";
import {BatchRequestRepository} from "../repositories/batchRequest.repository";
import {BatchRequest} from "../models/BatchRequest";

export class BatchRequestService extends BaseService<BatchRequest> {
    constructor(
        private readonly batchRequestRepository: BatchRequestRepository<BatchRequest>
    ){
        super(batchRequestRepository);
    }
}
