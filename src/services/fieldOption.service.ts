import {BaseService} from "../common/controllers/base.service";
import {FieldOption} from "../models/FieldOption";
import {FieldOptionRepository} from "../repositories/fieldOption.repository";

export class FieldOptionService extends BaseService<FieldOption> {
    constructor(
        private readonly fieldOptionRepository: FieldOptionRepository<FieldOption>
    ){
        super(fieldOptionRepository);
    }

    async findByName(name) : Promise<FieldOption>{
        return await this.fieldOptionRepository.findByObject({ name: name})[0];
    }
    async findByGroup(group): Promise<FieldOption[]>{
        return await this.fieldOptionRepository.findByObject({ group: group});
    }
}

