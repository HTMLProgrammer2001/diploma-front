import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'translateAttribute'
})
export class TranslateAttributePipe implements PipeTransform {
  transform(translateKey: string, additionalTranslationKeys: string): string {
    if (translateKey && additionalTranslationKeys) {
      translateKey += `,${additionalTranslationKeys}`;
      return translateKey;
    }

    if (!translateKey && additionalTranslationKeys) {
      return additionalTranslationKeys;
    }

    return translateKey;
  }
}
