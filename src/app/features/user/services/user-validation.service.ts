import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class UserValidationService {
  getUserValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'fullName',
        messageTranslateKey: 'USER.DETAILS.VALIDATION.REQUIRED_FULL_NAME'
      },
      {
        type: ValidationTypes.maxLength,
        settingValue: 255,
        fieldName: 'fullName',
        messageTranslateKey: 'USER.DETAILS.VALIDATION.MAX_LENGTH_FULL_NAME'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'email',
        messageTranslateKey: 'USER.DETAILS.VALIDATION.REQUIRED_EMAIL'
      },
      {
        type: ValidationTypes.email,
        fieldName: 'email',
        messageTranslateKey: 'USER.DETAILS.VALIDATION.INVALID_EMAIL'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'email',
        settingValue: 255,
        messageTranslateKey: 'USER.DETAILS.VALIDATION.MAX_LENGTH_EMAIL'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'password',
        messageTranslateKey: 'USER.DETAILS.VALIDATION.REQUIRED_PASSWORD'
      },
      {
        type: ValidationTypes.customValidationWithFunction,
        fieldName: 'password',
        settingValue: {min: 8, max: 255},
        customFunction: password => !password || (password?.length >= 8 && password.length <= 255),
        messageTranslateKey: 'USER.DETAILS.VALIDATION.INVALID_PASSWORD'
      },
      {
        type: ValidationTypes.phone,
        fieldName: 'phone',
        messageTranslateKey: 'USER.DETAILS.VALIDATION.INVALID_PHONE'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'role.id',
        messageTranslateKey: 'USER.DETAILS.VALIDATION.REQUIRED_ROLE'
      },
    );
  }
}
