import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';


@Injectable({providedIn: 'root'})
export class ImportValidationService {
  getValidator() {
    return new Validator(
      {
        type: ValidationTypes.numberGreaterThan,
        settingValue: 'from',
        fieldName: 'to',
        messageTranslateKey: 'IMPORT.VALIDATION.TO_MUST_BE_GREATER_THAN_FROM',
      },
      {
        type: ValidationTypes.numberLessThan,
        settingValue: 'to',
        fieldName: 'from',
        messageTranslateKey: 'IMPORT.VALIDATION.FROM_MUST_BE_LESS_THAN_TO',
      },
      {
        type: ValidationTypes.required,
        fieldName: 'type',
        messageTranslateKey: 'IMPORT.VALIDATION.REQUIRED_TYPE',
      },
      {
        type: ValidationTypes.required,
        fieldName: 'file',
        messageTranslateKey: 'IMPORT.VALIDATION.REQUIRED_FILE',
      }
    );
  }
}
