import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class AcademicDegreeValidationService {
  getAcademicDegreeValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'name',
        messageTranslateKey: 'ACADEMIC_DEGREE.DETAILS.VALIDATION.REQUIRED_NAME'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'name',
        settingValue: 255,
        messageTranslateKey: 'ACADEMIC_DEGREE.DETAILS.VALIDATION.MAX_LENGTH_NAME'
      }
    );
  }
}
