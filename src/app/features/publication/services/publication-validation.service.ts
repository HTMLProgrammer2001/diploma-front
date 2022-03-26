import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';
import {IPublicationViewModel} from '../types/view-model/publication-view-model';

@Injectable({providedIn: 'root'})
export class PublicationValidationService {
  getPublicationValidator(): Validator {
    return new Validator(
      {
        type: ValidationTypes.required,
        fieldName: 'title',
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.REQUIRED_TITLE'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'title',
        settingValue: 255,
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.MAX_LENGTH_TITLE'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'date',
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.REQUIRED_DATE'
      },
      {
        type: ValidationTypes.minDate,
        settingValue: new Date(0),
        fieldName: 'date',
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.INVALID_MIN_DATE'
      },
      {
        type: ValidationTypes.maxDate,
        settingValue: new Date(),
        fieldName: 'date',
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.INVALID_MAX_DATE'
      },
      {
        type: ValidationTypes.required,
        fieldName: 'teachers',
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.REQUIRED_TEACHERS'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'anotherAuthors',
        settingValue: 255,
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.MAX_LENGTH_ANOTHER_AUTHORS'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'publisher',
        settingValue: 255,
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.MAX_LENGTH_PUBLISHER'
      },
      {
        type: ValidationTypes.pattern,
        fieldName: 'url',
        settingValue: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.INVALID_URL'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'url',
        settingValue: 2000,
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.MAX_LENGTH_URL'
      },
      {
        type: ValidationTypes.maxLength,
        fieldName: 'description',
        settingValue: 65535,
        messageTranslateKey: 'PUBLICATION.DETAILS.VALIDATION.MAX_LENGTH_DESCRIPTION'
      },
    );
  }
}
