import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class HonorValidationService {
  getHonorValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'title',
        messageTranslateKey: 'HONOR.DETAILS.VALIDATION.REQUIRED_TITLE'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'title',
        settingValue: 255,
        messageTranslateKey: 'HONOR.DETAILS.VALIDATION.MAX_LENGTH_TITLE'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'orderNumber',
        settingValue: 255,
        messageTranslateKey: 'HONOR.DETAILS.VALIDATION.MAX_LENGTH_ORDER_NUMBER'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'date',
        messageTranslateKey: 'HONOR.DETAILS.VALIDATION.REQUIRED_DATE'
      },
      {
        type: ValidationTypes.minDate,
        settingValue: new Date(0),
        fieldName: 'date',
        messageTranslateKey: 'HONOR.DETAILS.VALIDATION.INVALID_MIN_DATE'
      },
      {
        type: ValidationTypes.maxDate,
        settingValue: new Date(),
        fieldName: 'date',
        messageTranslateKey: 'HONOR.DETAILS.VALIDATION.INVALID_MAX_DATE'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'description',
        settingValue: 65535,
        messageTranslateKey: 'HONOR.DETAILS.VALIDATION.MAX_LENGTH_DESCRIPTION'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'teacher.id',
        messageTranslateKey: 'HONOR.DETAILS.VALIDATION.REQUIRED_TEACHER'
      },
    );
  }
}
