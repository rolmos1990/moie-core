import {Attachment} from "../../models/Attachment";
import {Movement} from "../../models/Movement";
import {CONFIG_MEDIA} from "../../services/mediaManagement.service";

export const MovementListDTO = (item: Movement) => ({
    id: item ? item.id : null,
    description: item ? item.description : null,
    amount: item ? item.amount : null,
    date: item ? item.date : null,
    canceled: item.canceled
});

export const MovementDetailDTO = (item: Movement) => ({
    id: item ? item.id : null,
    description: item ? item.description : null,
    amount: item ? item.amount : null,
    date: item ? item.date : null,
    comment: item ? item.comment : null,
    attachments: item.attachments && item.attachments.length > 0 ? item.attachments.map(item => AttachmentDTO(item)) : [],
    canceled: item.canceled
});

export const AttachmentDTO = (item: Attachment) => ({
    id: item.id,
    type: item.type,
    description: item.description,
    filename: item.id + '.' + item.type,
    fileUrl: CONFIG_MEDIA.LOCAL_PATH + CONFIG_MEDIA.ATTACHMENT_PATH + "/" + item.id + '.' + item.type
});
