import {BaseService} from "../common/controllers/base.service";
import {Size} from "../models/Size";
import {SizeRepository} from "../repositories/size.repository";

export class SizeService extends BaseService<Size> {
    constructor(
        private readonly sizeRepository: SizeRepository<Size>
    ){
        super(sizeRepository);
    }
}
