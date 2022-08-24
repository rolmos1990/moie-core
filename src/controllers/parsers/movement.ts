import {Attachment} from "../../models/Attachment";
import {Movement} from "../../models/Movement";

export const MovementListDTO = (item: Movement) => ({
    id: item ? item.id : null,
    description: item ? item.description : null,
    amount: item ? item.amount : null,
    date: item ? item.date : null
});

export const MovementDetailDTO = (item: Movement) => ({
    id: item ? item.id : null,
    description: item ? item.description : null,
    amount: item ? item.amount : null,
    date: item ? item.date : null,
    comment: item ? item.comment : null,
    attachments: item.attachments && item.attachments.length > 0 ? item.attachments.map(item => AttachmentDTO(item)) : []
});

export const AttachmentDTO = (item: Attachment) => ({
    id: item.id,
    type: item.type,
    description: item.description,
    filename: 'test.png',
    fileUrl: 'test.png'
});
