import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';

@Injectable({providedIn: 'root'})
export class AttestationValidationService {
  getAttestationValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'teacher.id',
        messageTranslateKey: 'ATTESTATION.DETAILS.VALIDATION.REQUIRED_TEACHER'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'category.id',
        messageTranslateKey: 'ATTESTATION.DETAILS.VALIDATION.REQUIRED_CATEGORY'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'description',
        settingValue: 65535,
        messageTranslateKey: 'ATTESTATION.DETAILS.VALIDATION.MAX_LENGTH_DESCRIPTION'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'date',
        messageTranslateKey: 'ATTESTATION.DETAILS.VALIDATION.REQUIRED_DATE'
      },
      {
        type: ValidationTypes.minDate,
        settingValue: new Date(0),
        fieldName: 'date',
        messageTranslateKey: 'ATTESTATION.DETAILS.VALIDATION.INVALID_MIN_DATE'
      },
      {
        type: ValidationTypes.maxDate,
        settingValue: new Date(),
        fieldName: 'date',
        messageTranslateKey: 'ATTESTATION.DETAILS.VALIDATION.INVALID_MAX_DATE'
      },
    );
  }
}
