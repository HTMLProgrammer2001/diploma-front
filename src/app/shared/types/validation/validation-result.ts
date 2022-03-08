import {ValidationMessage} from './validation-message';

export class ValidationResult {
  isValid: boolean;
  messages: Array<ValidationMessage>;
  //toolTipMessage?: string;

  constructor() {
    this.isValid = true;
    this.messages = new Array<ValidationMessage>();
    //this.toolTipMessage = null;
  }
}
