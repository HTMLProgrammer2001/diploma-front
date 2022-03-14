import {AfterContentChecked, Component, HostListener, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from './global/services/language.service';
import {MessageService} from '@progress/kendo-angular-l10n';
import {ConfigService} from './global/services/config/config.service';
import {BookmarkStoreService} from './global/services/bookmark/bookmark-store.service';
import {BookmarkService} from './global/services/bookmark/bookmark.service';
import {isLanguageRtl} from './shared/utils';
import {IntlService} from '@progress/kendo-angular-intl';
import {AuthService} from './global/services/auth/auth.service';

@Component({
  selector: 'cr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, AfterContentChecked {
  private isUnloadInProgress = false;

  constructor(
    private configService: ConfigService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private messages: MessageService,
    private translate: TranslateService,
    private authService: AuthService,
    private intlService: IntlService,
    private bookmarkService: BookmarkService,
    private bookmarkStoreService: BookmarkStoreService) {
  }

  ngAfterContentChecked(): void {
    this.messages.notify(isLanguageRtl(sessionStorage.getItem('currentLanguage')));
  }

  ngOnDestroy(): void {
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler() {
    this.unload();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this.unload();
  }

  unload() {
    if (!this.isUnloadInProgress) {
      this.isUnloadInProgress = true;
      this.bookmarkStoreService.setTaskList(this.bookmarkService.taskBookmarkCollection);
      this.bookmarkStoreService.deleteAllBookmarks().subscribe(_ => {
      });
    }
  }
}
