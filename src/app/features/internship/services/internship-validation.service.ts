import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class EducationValidationService {
  getEducationValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'teacher.id',
        messageTranslateKey: 'EDUCATION.DETAILS.VALIDATION.REQUIRED_TEACHER'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'educationQualification.id',
        messageTranslateKey: 'EDUCATION.DETAILS.VALIDATION.REQUIRED_EDUCATION_QUALIFICATION'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'institution',
        messageTranslateKey: 'EDUCATION.DETAILS.VALIDATION.REQUIRED_INSTITUTION'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'institution',
        settingValue: 255,
        messageTranslateKey: 'EDUCATION.DETAILS.VALIDATION.MAX_LENGTH_INSTITUTION'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'specialty',
        messageTranslateKey: 'EDUCATION.DETAILS.VALIDATION.REQUIRED_SPECIALTY'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'specialty',
        settingValue: 255,
        messageTranslateKey: 'EDUCATION.DETAILS.VALIDATION.MAX_LENGTH_SPECIALTY'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'description',
        settingValue: 65535,
        messageTranslateKey: 'EDUCATION.DETAILS.VALIDATION.MAX_LENGTH_DESCRIPTION'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'yearOfIssue',
        messageTranslateKey: 'EDUCATION.DETAILS.VALIDATION.REQUIRED_YEAR_OF_ISSUE'
      },
      {
        type: ValidationTypes.minValue,
        fieldName: 'yearOfIssue',
        settingValue: 1970,
        messageTranslateKey: 'EDUCATION.DETAILS.VALIDATION.MIN_YEAR_OF_ISSUE'
      },
      {
        type: ValidationTypes.maxValue,
        fieldName: 'yearOfIssue',
        settingValue: new Date().getFullYear(),
        messageTranslateKey: 'EDUCATION.DETAILS.VALIDATION.MAX_YEAR_OF_ISSUE'
      }
    );
  }
}
