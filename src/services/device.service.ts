import {BaseService} from "../common/controllers/base.service";
import {Device} from "../models/Device";
import {DeviceRepository} from "../repositories/device.repository";

export class DeviceService extends BaseService<Device> {
    constructor(
        private readonly deviceRepository: DeviceRepository<Device>
    ){
        super(deviceRepository);
    }
}
