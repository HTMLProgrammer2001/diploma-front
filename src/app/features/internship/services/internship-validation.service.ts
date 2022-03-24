import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class InternshipValidationService {
  getInternshipValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'title',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.REQUIRED_TITLE'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'title',
        settingValue: 255,
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.MAX_LENGTH_TITLE'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'from',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.REQUIRED_FROM'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'to',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.REQUIRED_TO'
      },
      {
        type: ValidationTypes.minDate,
        settingValue: new Date(0),
        fieldName: 'from',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.INVALID_MIN_FROM'
      },
      {
        type: ValidationTypes.maxDate,
        settingValue: new Date(),
        fieldName: 'from',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.INVALID_MAX_FROM'
      },
      {
        type: ValidationTypes.minDate,
        settingValue: new Date(0),
        fieldName: 'to',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.INVALID_MIN_TO'
      },
      {
        type: ValidationTypes.maxDate,
        settingValue: new Date(),
        fieldName: 'to',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.INVALID_MAX_TO'
      },
      {
        type: ValidationTypes.dateLessThan,
        fieldName: 'from',
        settingValue: 'to',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.FROM_LESS'
      },
      {
        type: ValidationTypes.dateGreaterThan,
        fieldName: 'to',
        settingValue: 'from',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.TO_GREATER'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'code',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.REQUIRED_CODE'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'code',
        settingValue: 255,
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.MAX_LENGTH_CODE'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'place',
        settingValue: 255,
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.MAX_LENGTH_PLACE'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'description',
        settingValue: 65535,
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.MAX_LENGTH_DESCRIPTION'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'hours',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.REQUIRED_HOURS'
      },
      {
        type: ValidationTypes.minValue,
        fieldName: 'hours',
        settingValue: 1,
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.MIN_HOURS'
      },
      {
        type: ValidationTypes.minValue,
        fieldName: 'credits',
        settingValue: 0,
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.MIN_CREDITS'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'teacher.id',
        messageTranslateKey: 'INTERNSHIP.DETAILS.VALIDATION.REQUIRED_TEACHER'
      },
    );
  }
}
