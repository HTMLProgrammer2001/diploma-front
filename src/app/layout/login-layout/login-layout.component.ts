import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {addRemoveClass, isLanguageRtl} from '../../shared/utils';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../global/services/language.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'cr-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private translateService: TranslateService,
    private languageService: LanguageService,
  ) {
  }

  ngOnInit(): void {
    forkJoin({
      globalLanguages: this.languageService.getLanguages$(),
      globalDefaultLanguage: this.languageService.getDefaultLanguage$()
    }).subscribe(({globalLanguages, globalDefaultLanguage}) => {
      let currentLanguage = globalLanguages.find(lang => lang.code === this.languageService.getCurrentLanguageCode());

      if (!currentLanguage) {
        currentLanguage = globalDefaultLanguage;
      }

      this.languageService.setCurrentLanguage(currentLanguage);
      addRemoveClass(this.document.body, 'rtl-on', isLanguageRtl(currentLanguage.code));
    });
  }
}
