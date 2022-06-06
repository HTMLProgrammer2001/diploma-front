import {NotificationTypesEnum} from '../common/notification-types.enum';

export interface INotificationConfigModel {
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
