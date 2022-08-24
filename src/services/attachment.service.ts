import {BaseService} from "../common/controllers/base.service";
import {Attachment} from "../models/Attachment";
import {AttachmentRepository} from "../repositories/attachment.repository";

export class AttachmentService extends BaseService<Attachment> {
    constructor(
        private readonly attachmentRepository: AttachmentRepository<Attachment>
    ){
        super(attachmentRepository);
    }
}
