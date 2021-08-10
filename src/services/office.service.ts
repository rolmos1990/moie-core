import {BaseService} from "../common/controllers/base.service";
import {OfficeRepository} from "../repositories/office.repository";
import {Office} from "../models/Office";

export class OfficeService extends BaseService<Office> {
    constructor(
        private readonly officeRepository: OfficeRepository<Office>
    ){
        super(officeRepository);
    }

    getRepository(){
        return this.officeRepository;
    }
}
