import { Pipe, PipeTransform } from '@angular/core';
import {ValidationMessage} from '../types/validation/validation-message';
import {TranslateService} from '@ngx-translate/core';
import {isEmpty} from 'lodash';

@Pipe({
  name: 'validationMessageTranslate'
})
export class ValidationMessageTranslatePipe implements PipeTransform {
constructor(private translate: TranslateService) {
}
  transform(value: Array<ValidationMessage>): string {
    let result = '';
    if (!isEmpty(value)){
      result = value.map(item =>
        item.message ?? this.translate.instant(item.messageTranslateKey, item.replacers) ?? null).join('<br>');
    }
    return result;
  }

}
