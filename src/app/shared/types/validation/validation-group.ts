import {ValidationRule} from './validation-rule';
import {ValidationResult} from './validation-result';

export class ValidationGroup {
  fieldName: string;
  validationRules: Array<ValidationRule>;
  validationResult: ValidationResult;
  constructor() {
    this.validationRules = new Array<ValidationRule>();
    this.validationResult = new ValidationResult();
  }
}
