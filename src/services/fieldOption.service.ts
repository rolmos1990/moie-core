import {BaseService} from "../common/controllers/base.service";
import {FieldOption} from "../models/FieldOption";
import {FieldOptionRepository} from "../repositories/fieldOption.repository";

export class FieldOptionService extends BaseService<FieldOption> {
    constructor(
        private readonly fieldOptionRepository: FieldOptionRepository<FieldOption>
    ){
        super(fieldOptionRepository);
    }
}
