import {BaseController} from "../common/controllers/base.controller";
import {EntityTarget} from "typeorm";
import {GET, POST, route} from "awilix-express";
import {Movement} from "../models/Movement";
import {MovementService} from "../services/movement.service";
import {Request, Response} from "express";
import * as moment from "moment";
import {MediaManagementService} from "../services/mediaManagement.service";
import {AttachmentService} from "../services/attachment.service";
import {MovementDetailDTO, MovementListDTO} from "./parsers/movement";

@route('/movement')
export class MovementController extends BaseController<Movement> {
    constructor(
        private readonly movementService: MovementService,
        private readonly mediaManagementService: MediaManagementService,
        private readonly attachmentService: AttachmentService
    ){
        super(movementService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<Movement> {
        return Movement;
    }

    getInstance(): Object {
        return new Movement();
    }

    getParseGET(entity: Movement, isDetail): Object {
        if(isDetail){
            return MovementDetailDTO(entity);
        } else {
            return MovementListDTO(entity);
        }
    }

    getParsePOST(entity: Movement): Object {
        return entity;
    }

    getParsePUT(entity: Movement): Object {
        return entity;
    }

    @route('/reports/stats')
    @GET()
    public async getReport(req: Request, res: Response) {
        try {
        const wallet = await this.movementService.getReport();
        return res.json({wallet: wallet}).status(200);
        }catch(e){
            this.handleException(e, res);
        }
    }

    @route('/:id/addAttachment')
    @POST()
    public async addAttachment(req: Request, res: Response) {
        const id = req.params.id; //id movement
        const {description, file, filename} = req.body;

        const defaultPaths = this.mediaManagementService.getDefaultPaths();
        const fileType = this.mediaManagementService.getExtension(file, filename);

        const movement = await this.movementService.find(parseInt(id));
        const _attachment = await this.attachmentService.createOrUpdate({
            movement,
            type: fileType,
            description: description
        });

        const _newFileName = _attachment.id + '.' + fileType;

        try {
            this.mediaManagementService.addFileFromBinary(defaultPaths.ATTACHMENT_PATH, _newFileName, file);
        }catch(e){
            await this.attachmentService.delete(_attachment.id);
            this.handleException(e, res);
        }
        return res.json({attachment: _attachment}).status(200);
    }



    @route('/checkTimeZone')
    @GET()
    public checkTimeZone(req: Request, res: Response) {
        try {
            res.json({
                currentTime: moment().format("YYYY-MM-DD-H-mm")
            });
        }catch(e){
            this.handleException(e, res);
            console.log("error", e);
        }
    }

    protected getDefaultRelations(isDetail): Array<string> {
        if(isDetail) {
            return ['attachments'];
        } else {
            return [];
        }
    }
    getGroupRelations(): Array<string> {
        return [];
    }

}
