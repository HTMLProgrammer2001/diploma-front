import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class AcademicTitleValidationService {
  getAcademicTitleValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'name',
        messageTranslateKey: 'ACADEMIC_TITLE.DETAILS.VALIDATION.REQUIRED_NAME'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'name',
        settingValue: 255,
        messageTranslateKey: 'ACADEMIC_TITLE.DETAILS.VALIDATION.MAX_LENGTH_NAME'
      }
    );
  }
}
