import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class TeacherValidationService {
  getTeacherValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'fullName',
        groupResultName: 'personal',
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.REQUIRED_NAME'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'email',
        groupResultName: 'personal',
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.REQUIRED_EMAIL'
      },
      {
        type: ValidationTypes.email,
        fieldName: 'email',
        groupResultName: 'personal',
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.INVALID_EMAIL'
      },
      {
        type: ValidationTypes.phone,
        fieldName: 'phone',
        groupResultName: 'personal',
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.INVALID_PHONE'
      },
      {
        type: ValidationTypes.minDate,
        settingValue: new Date(0),
        fieldName: 'birthday',
        groupResultName: 'personal',
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.INVALID_MIN_BIRTHDAY'
      },
      {
        type: ValidationTypes.maxDate,
        settingValue: new Date(),
        fieldName: 'birthday',
        groupResultName: 'personal',
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.INVALID_MAX_BIRTHDAY'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'commission.id',
        groupResultName: 'professional',
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.REQUIRED_COMMISSION'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'department.id',
        groupResultName: 'professional',
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.REQUIRED_DEPARTMENT'
      },
      {
        type: ValidationTypes.minDate,
        settingValue: new Date(0),
        fieldName: 'workStartDate',
        groupResultName: 'professional',
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.INVALID_MIN_WORK_START_DATE'
      },
      {
        type: ValidationTypes.maxDate,
        settingValue: new Date(),
        fieldName: 'workStartDate',
        groupResultName: 'personal',
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.INVALID_MAX_WORK_START_DATE'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'fullName',
        settingValue: 255,
        messageTranslateKey: 'TEACHER.DETAILS.VALIDATION.MAX_LENGTH_NAME'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'address',
        settingValue: 255,
        messageTranslateKey: 'COMMISSION.DETAILS.VALIDATION.MAX_LENGTH_ADDRESS'
      }
    );
  }
}
