import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DialogRef} from '@progress/kendo-angular-dialog';
import {CustomNotificationService} from '../../global/services/custom-notification.service';
import {BookmarkService} from '../../global/services/bookmark.service';
import {fromEvent, ReplaySubject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {AuthService} from '../../global/services/auth/auth.service';
import {NetworkStatusService} from '../../global/services/network-status.service';
import {LanguageService} from '../../global/services/language.service';
import {ErrorService} from '../../global/services/error.service';
import {ILanguageViewModel} from '../../global/types/language';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'cr-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('divElement') divElement;
  public collapsedMenu = false;
  public fullScreen = false;
  private dialogRef: DialogRef;
  public languages: Array<ILanguageViewModel> = [];

  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private title: Title,
    private router: Router,
    private customNotificationService: CustomNotificationService,
    public networkStatusService: NetworkStatusService,
    private bookmarkService: BookmarkService,
    private languageService: LanguageService,
    private errorService: ErrorService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.initScrollWatcher();
    this.addEventForTimerOnAppStart();

    this.languageService.getLanguages$().subscribe(
      languages => this.languages = languages,
      error => this.customNotificationService.showDialogError(this.errorService.getMessagesToShow(error.errors))
    );
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
    this.dialogRef?.close();
  }

  initScrollWatcher() {
    // latest content container where ID=content
    const contents = this.document.querySelectorAll('[id=content]');
    const content = contents[contents.length - 1];

    fromEvent(content, 'scroll')
      .pipe(
        debounceTime(50),
        takeUntil(this.onDestroy),
      )
      .subscribe(_ => {
        const currentBookmark = this.bookmarkService.getCurrent();

        if (!currentBookmark.popupTab.scrollBlock) {
          const activeIndexTab = currentBookmark.popupTab.activeTabIndex;
          const tab = currentBookmark.popupTab.tabs[activeIndexTab];
          tab.scrollPositionOffset = this.divElement.nativeElement.scrollTop;
          tab.contentElementHeight = this.divElement.nativeElement.scrollHeight;
        }
      });
  }

  changeScreenSize(): void {
    if (!this.fullScreen) {
      this.document.documentElement.requestFullscreen();
    } else {
      this.document.exitFullscreen();
    }
    this.fullScreen = !this.fullScreen;
  }

  collapseState(): void {
    this.collapsedMenu = !this.collapsedMenu;
  }

  addEventForTimerOnAppStart() {
    const mainWrapper = document.getElementById('main-section');
    fromEvent(mainWrapper, 'click')
      .pipe(
        takeUntil(this.onDestroy)
      ).subscribe(() => {
      this.authService.lastActivityTime = new Date();
    });
  }

  logout() {
    this.authService.logout().subscribe(
      null,
        error => this.customNotificationService.showDialogError(this.errorService.getMessagesToShow(error.errors))
    );
  }
}
