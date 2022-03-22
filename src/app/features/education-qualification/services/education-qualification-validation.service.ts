import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class EducationQualificationValidationService {
  getEducationQualificationValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'name',
        messageTranslateKey: 'EDUCATION_QUALIFICATION.DETAILS.VALIDATION.REQUIRED_NAME'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'name',
        settingValue: 255,
        messageTranslateKey: 'EDUCATION_QUALIFICATION.DETAILS.VALIDATION.MAX_LENGTH_NAME'
      }
    );
  }
}
