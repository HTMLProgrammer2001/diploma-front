import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class NotificationValidationService {
  getValidator() {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'attestationYearsPeriod',
        messageTranslateKey: 'NOTIFICATION.VALIDATION.REQUIRED_ATTESTATION_YEARS_PERIOD'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'requiredInternshipHours',
        messageTranslateKey: 'NOTIFICATION.VALIDATION.REQUIRED_INTERNSHIP_HOURS'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'notifyBeforeDays',
        messageTranslateKey: 'NOTIFICATION.VALIDATION.REQUIRED_NOTIFY_BEFORE_DAYS'
      },
      {
        type: ValidationTypes.customValidationWithFunction,
        customFunction: (adminEmails: Array<string>) => adminEmails.every(email => {
          const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(email);
        }),
        fieldName: 'adminEmails',
        messageTranslateKey: 'NOTIFICATION.VALIDATION.INVALID_ADMIN_EMAILS'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'notifyType',
        messageTranslateKey: 'NOTIFICATION.VALIDATION.REQUIRED_NOTIFY_TYPE'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'notifyTime',
        messageTranslateKey: 'NOTIFICATION.VALIDATION.REQUIRED_NOTIFY_TIME'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'notifyDay',
        messageTranslateKey: 'NOTIFICATION.VALIDATION.REQUIRED_NOTIFY_DAY'
      }
    );
  }
}
