import {Injectable} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ValidationTypes} from '../../../shared/types/validation/validation-types';
import {IGenerateReportFilterViewModel} from '../types/view-model/generate-report-filter-view-model';


@Injectable({providedIn: 'root'})
export class ExportValidationService {
  getValidator() {
    return new Validator(
      {
        type: ValidationTypes.dateLessThan,
        settingValue: 'to',
        messageTranslateKey: 'EXPORT.VALIDATION.FROM_MUST_BE_LESS_THAN_TO',
        fieldName: 'from'
      },
      {
        type: ValidationTypes.dateGreaterThan,
        settingValue: 'from',
        messageTranslateKey: 'EXPORT.VALIDATION.TO_MUST_BE_GREATER_THAN_FROM',
        fieldName: 'to'
      },
      {
        type: ValidationTypes.customValidationWithFunction,
        customFunction: (_, dto: IGenerateReportFilterViewModel) => dto.select.length >= 1,
        messageTranslateKey: 'EXPORT.VALIDATION.MIN_LENGTH_SELECT',
        fieldName: 'select'
      }
    );
  }
}
