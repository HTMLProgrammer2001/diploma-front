import {TranslateService} from '@ngx-translate/core';
import {Injectable} from '@angular/core';
import {MessageService} from '@progress/kendo-angular-l10n';
import {map} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {CldrIntlService, IntlService} from '@progress/kendo-angular-intl';
import {ILanguageViewModel} from '../types/language/language';

enum LanguageStorageKeys {
  currentLanguage = 'currentLanguage',
  defaultLocale = 'defaultLocale'
}

const APP_LANGUAGES = [{
  id: 1,
  name: 'English',
  code: 'en-US',
  isDefault: true,
  icon: 'icon-english'
}, {
  id: 2,
  name: 'Русский',
  code: 'ru-RU',
  isDefault: false,
  icon: 'icon-russian'
}, {
  id: 3,
  name: 'Українська',
  code: 'uk-UA',
  isDefault: false,
  icon: 'icon-ukrainian'
}];

@Injectable({
  providedIn: 'root',
})
export class LanguageService extends MessageService {
  public changeLanguage$ = new Subject<ILanguageViewModel>();

  constructor(private translate: TranslateService, public intlService: IntlService) {
    super();
  }

  public getLanguages$(): Observable<Array<ILanguageViewModel>> {
    return of(APP_LANGUAGES);
  }

  public getDefaultLanguage$(): Observable<ILanguageViewModel> {
    return of(APP_LANGUAGES.find(language => language.isDefault));
  }

  public getCurrentLanguageCode(): string {
    const languageCode = sessionStorage.getItem(LanguageStorageKeys.currentLanguage)
      || localStorage.getItem(LanguageStorageKeys.currentLanguage);

    return languageCode;
  }

  public getCurrentLanguage(): ILanguageViewModel {
    const languageCode = this.getCurrentLanguageCode();
    return APP_LANGUAGES.find(language => language.code === languageCode);
  }

  public setCurrentLanguage(language: ILanguageViewModel): void {
    localStorage.setItem(LanguageStorageKeys.currentLanguage, language.code);
    sessionStorage.setItem(LanguageStorageKeys.currentLanguage, language.code);
    (this.intlService as CldrIntlService).localeId = language.code;
    this.translate.use(language.code);
    this.changeLanguage$.next(language);
  }

  public getLocales(): Observable<Array<string>> {
    return this.getLanguages$().pipe(map(languages => languages.map(el => el.code)));
  }
}
