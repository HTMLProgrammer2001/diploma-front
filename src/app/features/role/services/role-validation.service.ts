import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class RoleValidationService {
  getRoleValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'code',
        messageTranslateKey: 'ADMIN_ROLE.ROLE_DETAILS.VALIDATION.REQUIRED_CODE'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'name',
        messageTranslateKey: 'ADMIN_ROLE.ROLE_DETAILS.VALIDATION.REQUIRED_NAME'
      });
  }
}
