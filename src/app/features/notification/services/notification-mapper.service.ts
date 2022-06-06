import {Injectable} from '@angular/core';
import {INotificationConfigModel} from '../types/model/notification-config-model';
import {INotificationConfigViewModel} from '../types/view-model/notification-config-view-model';
import {isNil} from 'lodash';
import {INotificationUpdateModel} from '../types/model/notification-update-model';
import {INotificationTeacherModel} from '../types/model/notification-teacher-model';
import {INotificationTeacherViewModel} from '../types/view-model/notification-teacher-view-model';
import {NotificationTypesEnum} from '../types/common/notification-types.enum';

@Injectable({providedIn: 'root'})
export class NotificationMapperService {
  notificationConfigModelToViewModel(source: INotificationConfigModel): INotificationConfigViewModel {
    let destination = {} as INotificationConfigViewModel;

    if (!isNil(source)) {
      destination = {
        adminEmails: source.adminEmails,
        attestationYearsPeriod: source.attestationYearsPeriod,
        isNotifyAdmins: source.isNotifyAdmins,
        isNotifyTeachers: source.isNotifyTeachers,
        notifyDay: source.notifyDay,
        notifyTime: source.notifyTime,
        notifyType: source.notifyType,
        notifyBeforeDays: source.notifyBeforeDays,
        requiredInternshipHours: source.requiredInternshipHours,
        schedule: source.schedule
      };
    }

    return destination;
  }

  notificationConfigViewModelToUpdateModel(source: INotificationConfigViewModel): INotificationUpdateModel {
    let destination = {} as INotificationUpdateModel;

    if (!isNil(source)) {
      destination = {
        adminEmails: source.adminEmails,
        attestationYearsPeriod: source.attestationYearsPeriod,
        isNotifyAdmins: source.isNotifyAdmins,
        isNotifyTeachers: source.isNotifyTeachers,
        notifyDay: source.notifyType !== NotificationTypesEnum.DAILY ? source.notifyDay : 0,
        notifyTime: source.notifyTime,
        notifyType: source.notifyType,
        notifyBeforeDays: source.notifyBeforeDays,
        requiredInternshipHours: source.requiredInternshipHours
      };
    }

    return destination;
  }

  notificationTeacherModelToViewModel(source: INotificationTeacherModel): INotificationTeacherViewModel {
    let destination = {} as INotificationTeacherViewModel;

    if (!isNil(source)) {
      destination = {
        teacherId: source.teacher?.id,
        teacherEmail: source.teacher?.email,
        teacherName: source.teacher?.name,
        internshipHours: source.internshipHours,
        lastAttestationDate: source.lastAttestationDate,
        nextAttestationDate: source.nextAttestationDate
      };
    }

    return destination;
  }
}
