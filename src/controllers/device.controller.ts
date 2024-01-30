import {Request, Response} from 'express';
import {route, GET, POST} from 'awilix-express';
import {DeviceService} from "../services/device.service";
import {BaseController} from "../common/controllers/base.controller";
import {Device} from "../models/Device";
import {EntityTarget} from "typeorm";
import {FieldOptionService} from "../services/fieldOption.service";

@route('/device')
export class DeviceController extends BaseController<Device> {
    constructor(
        protected readonly deviceService: DeviceService,
        protected readonly fieldOptionService: FieldOptionService
    ){
        super(deviceService);
    };

    public getInstance() : Device{
        return new Device();
    }

    getParseGET(entity: Device): Object {
        return entity;
    }

    getParsePOST(entity: Device): Object {
        return entity;
    }

    getParsePUT(entity: Device): Object {
        return entity;
    }

    public getEntityTarget(): EntityTarget<any> {
        return Device;
    }

    @route("/validateAccess")
    @POST()
    public async validateAccess(req: Request, res: Response) {
        try {

            const securityValidatorEnabled = await this.fieldOptionService.findByGroup('SECURITY_VALIDATOR');
            console.log(securityValidatorEnabled);
            const isEnabled = securityValidatorEnabled[0].value;
            const {deviceId} = req.body;

            if(!parseInt(isEnabled)){
                //simulo estar activo debido, debido a que tengo desactivado el sistema de seguridad
                const register = new Device();
                register.createNew(deviceId);
                register.setActive();
                res.json({device: register});
            }

            const device = await this.deviceService.findByObject({device: deviceId});
            if(device && device.length > 0) {
                if(device[0].isActive()){
                    device[0].refreshDate();
                    const deviceSaved = await this.deviceService.createOrUpdate(device[0]);
                    res.json({device: deviceSaved});

                } else {
                    device[0].refreshDate();
                    await this.deviceService.createOrUpdate(device[0]);
                    res.json({device: device});
                }
            } else {
                //create request for pending
                const register = new Device();
                register.createNew(deviceId);
                const deviceSaved  = await this.deviceService.createOrUpdate(register);
                res.json({device: deviceSaved});
            }
        }catch(e){
            this.handleException(e, res);
        }
    }

    protected beforeCreate(item: Device){}
    protected afterCreate(item: Object): void {}
    protected afterUpdate(item: Object): void {}
    protected beforeUpdate(item: Object): void {}

    protected getDefaultRelations(isDetail): Array<string> {
        if(isDetail) {
            return ['securityRol', 'securityRol.permissions'];
        } else {
            return [];
        }
    }
    getGroupRelations(): Array<string> {
        return [];
    }
}
