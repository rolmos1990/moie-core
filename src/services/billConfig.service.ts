import {BaseService} from "../common/controllers/base.service";
import {BillConfig} from "../models/BillConfig";
import {BillConfigRepository} from "../repositories/billConfig.repository";

export class BillConfigService extends BaseService<BillConfig> {
    constructor(
        private readonly billConfigRepository: BillConfigRepository<BillConfig>
    ) {
        super(billConfigRepository);
    }
}