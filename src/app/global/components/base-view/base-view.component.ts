import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {BookmarkService} from '../../services/bookmark.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Bookmark} from '../../types/bookmark';
import {IBookmarkTask} from '../../types/bookmark-task';
import {isNil} from 'lodash';

@Component({
  selector: 'cr-base-view',
  template: '',
  styleUrls: ['./base-view.component.scss']
})
export class BaseViewComponent implements AfterViewInit {
  currentBookmark: Bookmark;
  currentBookmarkTask: IBookmarkTask;

  constructor(@Inject(String) public bookmarkTaskSettings: string | IBookmarkTask,
              protected bookmarkService: BookmarkService,
              protected router: Router,
              protected route: ActivatedRoute) {
    this.processBookmark(bookmarkTaskSettings as IBookmarkTask);
  }

  ngAfterViewInit(): void {
    this.bookmarkService.restoreScrollPosition();
  }

  processBookmark(bookmarkTaskSettings: IBookmarkTask): void {
    this.currentBookmark = this.bookmarkService.getCurrent();
    this.currentBookmarkTask = this.bookmarkService.getCurrentBookmarkTask();
    this.currentBookmarkTask.name = bookmarkTaskSettings.name;
    this.currentBookmarkTask.nameTranslateKey = bookmarkTaskSettings.nameTranslateKey;
    this.currentBookmarkTask.description = bookmarkTaskSettings.description;
    this.currentBookmarkTask.descriptionTranslateKey = bookmarkTaskSettings.descriptionTranslateKey;
    this.currentBookmarkTask.iconSvg = bookmarkTaskSettings.iconSvg;

    if (this.route && !isNil(this.currentBookmarkTask)) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams:
          {
            ...this.currentBookmarkTask.params,
            bookmarkId: this.currentBookmarkTask.id,
          },
        replaceUrl: true,
      });
    }
  }
}
