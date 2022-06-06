import {NotificationTypesEnum} from '../common/notification-types.enum';

export interface INotificationTypeViewModel {
  type: NotificationTypesEnum;
  translateKey: string;
}
