import {NotificationTypesEnum} from '../common/notification-types.enum';

export interface INotificationConfigViewModel {
  isNotifyTeachers: boolean;
  isNotifyAdmins: boolean;
  adminEmails: Array<string>;
  notifyType: NotificationTypesEnum;
  notifyDay: number;
  notifyTime: string;
  notifyBeforeDays: number;
  attestationYearsPeriod: number;
  requiredInternshipHours: number;
  schedule: string;
}
