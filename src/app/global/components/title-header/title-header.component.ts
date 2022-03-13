import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBookmarkTask} from '../../types/bookmark-task';
import {BookmarkService} from '../../services/bookmark.service';
import {CustomNotificationService} from '../../services/custom-notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {isNil} from 'lodash';
import {DialogCloseResult} from '@progress/kendo-angular-dialog';
import {CustomDialogResultEnum} from '../../../shared/types/custom-dialog-result.enum';
import {TitleHeaderElement} from '../../types/title-header/title-header-element';

@Component({
  selector: 'cr-title-header',
  templateUrl: './title-header.component.html',
  styleUrls: ['./title-header.component.scss']
})
export class TitleHeaderComponent implements OnInit {
  @Input() public isPopup: boolean;
  @Input() public title: string;

  /** Value for transaction translation */
  @Input() public titleTranslateKey: string;
  /** Value for translation (e.g titleTranslateKey: {{ value }}) */
  @Input() public titleValue: string;
  /** Translate keys are as an one string and separated by comma */
  @Input() public additionalTranslateKeys: string;

  @Input() public buttonSettings: Array<TitleHeaderElement>;
  @Output() public buttonClickEvent = new EventEmitter<TitleHeaderElement>();

  public currentBookmarkTask: IBookmarkTask;

  constructor(private bookmarkService: BookmarkService,
              private customNotificationService: CustomNotificationService,
              private translate: TranslateService,
              private router: Router) {
  }

  public onButtonClick(clickedButton: TitleHeaderElement): void {
    if (clickedButton.template !== 'custom') {
      switch (clickedButton.template) {
        case 'pin' :
          this.currentBookmarkTask.isPinned = !this.currentBookmarkTask.isPinned;
          this.buttonClickEvent.emit(clickedButton);
          break;

        case 'add':
        case 'delete':
        case 'update':
        case 'create':
        case 'cancel':
        case 'refresh':
        case 'restore':
        case 'cancel-restore':
        case 'confirm-restore':
        case 'close':
          this.buttonClickEvent.emit(clickedButton);
          break;
        case 'close-bookmark':
          this.close();
          this.buttonClickEvent.emit(clickedButton);
          break;
      }
    } else {
      this.buttonClickEvent.emit(clickedButton);
    }
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

  public close(): void {
    //const currentBookmark = this.bookmarkService.getCurrent();
    if ((!isNil(this.currentBookmarkTask.checkDataChanged) || !isNil(this.currentBookmarkTask.isDataChanged))
    && !isNil(this.currentBookmarkTask.checkDataChanged)
      ? this.currentBookmarkTask.checkDataChanged()
      : this.currentBookmarkTask.isDataChanged) {

      const dialogRef = this.customNotificationService.showDialogCloseNotSaved(this.getBookmarkName(this.currentBookmarkTask));
      dialogRef.result.subscribe((result) => {
        if (result instanceof DialogCloseResult) {

        } else {
          if ((result as any).customDialogResult === CustomDialogResultEnum.yes) {

            this.bookmarkService.deleteBookmarkById(this.bookmarkService.getCurrentId()).subscribe(task => {
              if (!isNil(task)) {
                this.router.navigateByUrl('/empty', {skipLocationChange: true}).then(() =>
                  this.router.navigate([task.route], {queryParams: {bookmarkId: task.id}}).then());
              } else {
                this.router.navigate(['/']).then();
              }
            });

          }
        }
      });
    } else {
      this.bookmarkService.deleteBookmarkById(this.bookmarkService.getCurrentId()).subscribe(task => {
        if (!isNil(task)) {
          this.router.navigateByUrl('/empty', {skipLocationChange: true}).then(() =>
            this.router.navigate([task.route], {queryParams: {bookmarkId: task.id}}).then());
        } else {
          this.router.navigate(['/']).then();
        }
      });
    }
  }

  public ngOnInit(): void {
    this.currentBookmarkTask = this.bookmarkService.getCurrentBookmarkTask();
  }
}
