import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class ProfileValidationService {
  getUserValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'fullName',
        messageTranslateKey: 'PROFILE.VALIDATION.REQUIRED_FULL_NAME'
      },
      {
        type: ValidationTypes.maxLength,
        settingValue: 255,
        fieldName: 'fullName',
        messageTranslateKey: 'PROFILE.VALIDATION.MAX_LENGTH_FULL_NAME'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'email',
        messageTranslateKey: 'PROFILE.VALIDATION.REQUIRED_EMAIL'
      },
      {
        type: ValidationTypes.email,
        fieldName: 'email',
        messageTranslateKey: 'PROFILE.VALIDATION.INVALID_EMAIL'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'email',
        settingValue: 255,
        messageTranslateKey: 'PROFILE.VALIDATION.MAX_LENGTH_EMAIL'
      },
      {
        type: ValidationTypes.customValidationWithFunction,
        fieldName: 'password',
        settingValue: {min: 8, max: 255},
        customFunction: password => !password || (password?.length >= 8 && password.length <= 255),
        messageTranslateKey: 'PROFILE.VALIDATION.INVALID_PASSWORD'
      },
      {
        type: ValidationTypes.phone,
        fieldName: 'phone',
        messageTranslateKey: 'PROFILE.VALIDATION.INVALID_PHONE'
      },
    );
  }
}
