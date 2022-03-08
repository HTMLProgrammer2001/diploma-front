import {ValidationTypes} from './validation-types';

export class ValidationRule {
  fieldName: string;
  groupResultName?: string;
  type: ValidationTypes;
  settingValue?: any;
  message?: string;
  messageTranslateKey?: string;
  customFunction?: Function;
  isActive?: boolean;
}
