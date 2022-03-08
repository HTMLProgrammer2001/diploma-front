import {ValidationGroup} from './validation-group';
import {ValidationResult} from './validation-result';

export class ValidationGroupResult {
  groupName: string;
  validationGroups: Array<ValidationGroup>;
  validationResult: ValidationResult;
  isRequired: boolean;

  constructor() {
    this.validationResult = new ValidationResult();
    this.validationGroups = new Array<ValidationGroup>();
  }

}
