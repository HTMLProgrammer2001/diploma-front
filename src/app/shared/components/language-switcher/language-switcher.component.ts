import {Component, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ILanguageViewModel} from '../../../global/types/language/language';
import {LanguageService} from '../../../global/services/language.service';
import {addRemoveClass, isLanguageRtl} from '../../utils';
import {ErrorService} from '../../../global/services/error.service';
import {DOCUMENT} from '@angular/common';
import {CustomNotificationService} from '../../../global/services/custom-notification.service';

@Component({
  selector: 'cr-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnChanges {
  @Input() languages: Array<ILanguageViewModel> = [];
  @Input() popUpSettings: any;
  public selectedLanguageObject: ILanguageViewModel = {} as ILanguageViewModel;

  constructor(
    @Inject(DOCUMENT) private document,
    private languageService: LanguageService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.languages) {
      this.selectedLanguageObject = this.languages.find(value => value.code === this.languageService.getCurrentLanguageCode()) ||
        {} as ILanguageViewModel;
      addRemoveClass(this.document.body, 'rtl-on', isLanguageRtl(this.selectedLanguageObject.code));
    }
  }

  changeLanguage(language: ILanguageViewModel): void {
    if (this.selectedLanguageObject.code !== language.code) {
      this.selectedLanguageObject = language;
      this.languageService.setCurrentLanguage(this.selectedLanguageObject);
      const langSwitch = isLanguageRtl(this.selectedLanguageObject.code);
      addRemoveClass(this.document.body, 'rtl-on', langSwitch);
      this.customNotificationService.showSuccess(`Interface language was changed to "${this.selectedLanguageObject.code.toUpperCase()}"`);
    }
  }
}
