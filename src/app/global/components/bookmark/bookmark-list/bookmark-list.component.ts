import {Component, isDevMode, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Router} from '@angular/router';
import {BookmarkService} from '../../../services/bookmark/bookmark.service';
import {DialogCloseResult, DialogRef} from '@progress/kendo-angular-dialog';
import {MessageService} from '@progress/kendo-angular-l10n';
import {LanguageService} from '../../../services/language.service';
import {TranslateService} from '@ngx-translate/core';
import {CustomDialogResultEnum} from '../../../../shared/types/custom-dialog-result.enum';
import {CustomNotificationService} from '../../../services/custom-notification.service';
import {isNil} from 'lodash';
import {IBookmarkTask} from '../../../types/bookmark/bookmark-task';
import {ScrollPositionObject} from '../../../types/scroll-position-object';
import {isLanguageRtl} from '../../../../shared/utils';

@Component({
  selector: 'cr-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.scss']
})
export class BookmarkListComponent implements OnInit, OnDestroy {
  public bookmarkCollection: Array<string>;
  public dialogRef: DialogRef;
  public isDevelop: boolean;
  public scrollPosition: ScrollPositionObject;
  public eventMove: any;
  public eventUp: any;
  public scrollIntervalFunction: any;

  // private subscription: Subscription;

  constructor(
    public bookmarksService: BookmarkService,
    private messages: MessageService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private customNotificationService: CustomNotificationService,
    private router: Router) {
    this.bookmarkCollection = new Array<string>();

  }

  ngOnInit(): void {
    this.isDevelop = isDevMode();
    this.eventMove = this.mouseMoveHandler.bind(this);
    this.eventUp = this.mouseUpHandler.bind(this);
    this.scrollPosition = {
      top: 0,
      left: 0,
      x: 0,
      y: 0,
      globalDelta: 10,
      leftInitialPosition: 0,
      topInitialPosition: 0,
      isGrabbing: false
    };
  }

  public getBookmarkName(bookmarkTask: IBookmarkTask): string {
    let result = '';
    if (!isNil(bookmarkTask)) {
      if (!isNil(bookmarkTask.name)) {
        result = bookmarkTask.name.replace('{{value}}', bookmarkTask.nameValue ?? '');
      } else if (!isNil(bookmarkTask.nameTranslateKey)) {
        result = this.translate.instant(bookmarkTask.nameTranslateKey, {value: bookmarkTask.nameValue ?? ''});
      }
    }
    return result;
  }


  isDataChanged(task: IBookmarkTask): boolean {
    return ((!isNil(task.checkDataChanged) || !isNil(task.isDataChanged))
    && !isNil(task.checkDataChanged) ? task.checkDataChanged() : task.isDataChanged);
  }

  closeBookmark(bookmarkId: string): Promise<boolean> {
    //const currentBookmark = this.bookmarksService.getItemById(bookmarkId);
    if (!this.scrollPosition.isGrabbing) {
      const bookmarkTask = this.bookmarksService.getBookmarkTaskByBookmarkId(bookmarkId);
      if (this.isDataChanged(bookmarkTask)) {
        const dialogRef = this.customNotificationService.showDialogCloseNotSaved(this.getBookmarkName(bookmarkTask));
        dialogRef.result.subscribe((result) => {
          if (result instanceof DialogCloseResult) {

          } else {
            if ((result as any).customDialogResult === CustomDialogResultEnum.yes) {

              this.bookmarksService.deleteBookmarkById(bookmarkId).subscribe(task => {
                if (!isNil(task)) {
                  // return this.router.navigate([task.route], {queryParams: {bookmarkId: task.id}}).then();
                  this.router.navigateByUrl('/empty', {skipLocationChange: true}).then(() =>
                    this.router.navigate([task.route], {queryParams: {...task.params, bookmarkId: task.id}}).then());
                } else {
                  this.router.navigate(['/']).then();
                }
              });

            }
          }
        });

        return new Promise<boolean>(resolve => resolve);
      } else {

        this.bookmarksService.deleteBookmarkById(bookmarkId).subscribe(task => {
          if (this.dialogRef && this.bookmarksService.isEmpty()) {
            this.dialogRef.close();
          }

          if (!isNil(task)) {
            //return this.router.navigate([task.route], {queryParams: {bookmarkId: task.id}}).then();
            this.router.navigateByUrl('/empty', {skipLocationChange: true}).then(() =>
              this.router.navigate([task.route], {queryParams: {...task.params, bookmarkId: task.id}}).then());
          } else {
            return this.router.navigate(['/']).then();
          }
        });

      }
    }
  }

  closeAllBookmarks() {
    const bookmarkNamesWillBeClosed =
      this.bookmarksService.taskBookmarkCollection
        .filter(value => this.isTaskChanged(value))
        .map(item => this.getBookmarkName(item))
        .join(', ');

    if (bookmarkNamesWillBeClosed) {
      const dialogRef = this.customNotificationService.showDialogCloseNotSaved(bookmarkNamesWillBeClosed);
      dialogRef.result.subscribe((result) => {
        if (result instanceof DialogCloseResult) {
        } else {
          if ((result as any).customDialogResult === CustomDialogResultEnum.yes) {
            this.bookmarksService.deleteBookmarkAll().subscribe(_ =>
              this.navigateToCurrentBookmark());
          }
        }
      });
    } else {
      this.bookmarksService.deleteBookmarkAll().subscribe(_ =>
        this.navigateToCurrentBookmark());
    }
  }

  isTaskChanged(task: IBookmarkTask): boolean {
    return ((!isNil(task.checkDataChanged) || !isNil(task.isDataChanged))
    && !isNil(task.checkDataChanged) ? task.checkDataChanged() : task.isDataChanged);
  }

  chooseBookmark(bookmarkId: string, index: number) {
    if (this.bookmarksService.getCurrentId() !== bookmarkId && !this.scrollPosition.isGrabbing) {
      const item = this.bookmarksService.getBookmarkTaskByBookmarkId(bookmarkId);

      if (!isNil(item) && !isNil(item.route)) {
        this.router.navigateByUrl('/empty', {skipLocationChange: true}).then(() => {
          this.router.navigate([item.route], {queryParams: {...item.params, bookmarkId}});
        });
      } else {
        return this.router.navigate(['/']).then();
      }
    }
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  onOpenTaskbar(template: TemplateRef<any>): void {
    // this.dialogRef = this.dialogService.open({
    //   title: this.translate.instant('COMMON.TASK_BAR_MANAGER.TITLE'),
    //   content: template,
    //   maxHeight: 600,
    //   actions: [{
    //     text: this.translate.instant('COMMON.TASK_BAR_MANAGER.CLOSE'),
    //     primary: true
    //   }, {text: this.translate.instant('COMMON.TASK_BAR_MANAGER.FINISH_ALL_TASKS')}]
    // });
    this.dialogRef = this.customNotificationService.show({
      titleTranslateKey: 'COMMON.TASK_BAR_MANAGER.TITLE',
      contentTemplateRef: template,
      maxHeight: 600,
      actions: [{
        textTranslateKey: 'COMMON.TASK_BAR_MANAGER.CLOSE',
        primary: true
      }, {
        textTranslateKey: 'COMMON.TASK_BAR_MANAGER.FINISH_ALL_TASKS'
      }]
    });

    this.dialogRef.result.subscribe(result => {
      if (result instanceof DialogCloseResult) {
      } else {
        if (result.primary) {
          this.dialogRef.close();
        } else {
          this.closeAllBookmarks();
          this.dialogRef.close();
        }
      }
    });

    this.messages.notify(isLanguageRtl(this.languageService.getCurrentLanguageCode()));
  }

  //region Scroll button functions
  scrollButtonLeft(): void {
    const delta = -30;
    const taskbar = document.getElementById('main-task-container');
    this.scrollIntervalFunction = setInterval(() => {
      taskbar.scrollLeft += delta;
    }, 50);
  }

  scrollButtonRight(): void {
    const delta = 30;
    const taskbar = document.getElementById('main-task-container');
    this.scrollIntervalFunction = setInterval(() => {
      taskbar.scrollLeft += delta;
    }, 50);
  }

  removeScrollInterval(): void {
    clearInterval(this.scrollIntervalFunction);
  };

  //endregion Scroll button functions
  //Mouse wheel event
  onMouseWheelEvent(event: any): void {
    const delta = event.deltaY > 0 ? event.deltaY - 50 : event.deltaY + 50;
    const taskbar = document.getElementById('main-task-container').scrollLeft += delta;
  }

  private navigateToCurrentBookmark(): void {
    const bookmarkTask = this.bookmarksService.getCurrentBookmarkTask();
    const route = !!bookmarkTask ? bookmarkTask.route : '/';
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(
      () => this.router.navigate([route]).then()
    );
  }

  //region Mouse events for dragging
  public mouseDownHandler(e) {
    const taskbar: any = e.currentTarget;
    this.scrollPosition.left = taskbar.scrollLeft;
    this.scrollPosition.x = e.clientX;
    this.scrollPosition.leftInitialPosition = e.clientX;
    // Vertical position counting
    // this.scrollPosition.top = taskbar.scrollTop;
    // this.scrollPosition.y = e.clientY;
    taskbar.addEventListener('mousemove', this.eventMove);
    taskbar.addEventListener('mouseleave', this.eventUp);
    taskbar.addEventListener('mouseup', this.eventUp);
  }

  public mouseMoveHandler(e) {
    const taskbar: any = e.currentTarget;
    // How far the mouse has been moved
    const dx = e.clientX - this.scrollPosition.x;

    // Vertical position counting
    // const dy = e.clientY - this.scrollPosition.y;

    // Scroll the element
    // taskbar.scrollTop = this.scrollPosition.top - dy;
    //Check if drag is more then delta
    if (Math.abs(dx) > this.scrollPosition.globalDelta) {
      taskbar.style.cursor = 'grabbing';
      taskbar.scrollLeft = this.scrollPosition.left - dx;
      this.scrollPosition.isGrabbing = true;
    }
  };

  public mouseUpHandler(e) {
    const taskbar: any = e.currentTarget;
    taskbar.style.cursor = 'pointer';
    taskbar.removeEventListener('mousemove', this.eventMove);
    taskbar.removeEventListener('mouseleave', this.eventUp);
    taskbar.removeEventListener('mouseup', this.eventUp);
    setTimeout(() => {
      this.scrollPosition.isGrabbing = false;
    }, 10);
  };

  //endregion region Mouse events for dragging
}
