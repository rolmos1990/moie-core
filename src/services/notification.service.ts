import {BaseService} from "../common/controllers/base.service";
import {Notification} from "../models/Notification";
import {NotificationRepository} from "../repositories/notification.repository";

export class NotificationService extends BaseService<Notification> {
    constructor(
        private readonly notificationRepository: NotificationRepository<Notification>
    ){
        super(notificationRepository);
    }
}
