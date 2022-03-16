import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class TeachingRankValidationService {
  getTeachingRankValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'name',
        messageTranslateKey: 'TEACHING_RANK.DETAILS.VALIDATION.REQUIRED_NAME'
      });
  }
}
