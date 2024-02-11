import {BaseController} from "../common/controllers/base.controller";
import {VCard} from "../models/VCard";
import {EntityTarget} from "typeorm";
import {VCardService} from "../services/vcard.service";
import {DELETE, GET, POST, route} from "awilix-express";
import {Request, Response} from "express";
import * as moment from "moment";
import {PageQuery} from "../common/controllers/page.query";
import {ConditionalQuery} from "../common/controllers/conditional.query";

@route('/vcard')
export class VCardController extends BaseController<VCard> {
    constructor(
        private readonly vcardService: VCardService
    ){
        super(vcardService);
    };
    protected afterCreate(item: Object): void {
    }

    protected afterUpdate(item: Object): void {
    }

    protected beforeCreate(item: Object): void {
    }

    protected beforeUpdate(item: Object): void {
    }

    getEntityTarget(): EntityTarget<VCard> {
        return VCard;
    }

    getInstance(): Object {
        return new VCard();
    }

    getParseGET(entity: VCard): Object {
        return entity;
    }

    getParsePOST(entity: VCard): Object {
        return entity;
    }

    getParsePUT(entity: VCard): Object {
        return entity;
    }

    @route("/createVCard")
    @POST()
    public async createVCard(req: Request, res: Response) {
        try {
            const {initial, date, phones} = req.body;

            const dateFormatted = moment(date, "YYYY-MM-DD-H-mm").format("YYYY-MM-DD")

            const vcard = await this.vcardService.buildVCard(initial, dateFormatted, phones);
            const response : Array<VCard> = await this.vcardService.createOrUpdateMany(vcard);

            res.json({response: response});
        }catch(e){
            this.handleException(e, res);
        }
    }

    @route("/g/generateVCard")
    @GET()
    public async generateVCard(req: Request, res: Response) {
        try {
            const condition = new ConditionalQuery();
            const page = new PageQuery(1000, 0, condition);
            const vcardAll = await this.vcardService.all(page);

            let vCard = "";

            vcardAll.forEach(vcard => {
                vCard += `BEGIN:VCARD\r\n`;
                vCard += `VERSION:3.0\r\n`;
                vCard += `FN:${vcard.name}\r\n`;
                vCard += `N:${vcard.name};;;\r\n`;
                vCard += `TEL;TYPE=MAIN:${vcard.phone};;;\r\n`;
                vCard += `END:VCARD\r\n`;
            });

            const date = moment().format("YYYY-MM-DD");

            const base64File = Buffer.from(vCard).toString('base64');;

            return res.json({status: 200, data: base64File, name: date + '.vcf' } );

        }catch(e){
            console.log('e', e);
            this.handleException(e, res);
        }
    }

    @route("/c/clearVCard")
    @DELETE()
    public async cleanVCard(req: Request, res: Response) {
        try {
            await this.vcardService.clear();
            res.json({clear: true});
        }catch(e){
            this.handleException(e, res);
        }
    }

    protected getDefaultRelations(): Array<string> {
        return [];
    }
    getGroupRelations(): Array<string> {
        return [];
    }

}
