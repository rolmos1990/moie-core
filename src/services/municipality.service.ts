import {BaseService} from "../common/controllers/base.service";
import {Municipality} from "../models/Municipality";
import {MunicipalityRepository} from "../repositories/municipality.repository";

export class MunicipalityService extends BaseService<Municipality> {
    constructor(
        private readonly municipalityRepository: MunicipalityRepository<Municipality>
    ){
        super(municipalityRepository);
    }
}
