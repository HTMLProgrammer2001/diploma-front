import {Injectable} from '@angular/core';
import {Bookmark} from '../types/bookmark';
import {uniqueId} from '../../shared/utils';
import {IBookmarkData} from '../types/bookmark-data';
import {IBookmarkViewState} from '../types/bookmark-view-state';
import {Router} from '@angular/router';
import {IBookmarkTask} from '../types/bookmark-task';
import {BookmarkIcon} from '../../shared/constants/bookmark-icon';
import {cloneDeep, isEmpty, isNil} from 'lodash';
import {BookmarkStoreService} from './bookmark-store.service';
import {defer, forkJoin, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  public taskBookmarkCollection: Array<IBookmarkTask> = new Array<IBookmarkTask>();
  private bookmarkCollection: Array<Bookmark> = new Array<Bookmark>();
  private currentId: string;
  private currentBookmark: Bookmark;
  private currentBookmarkTask: IBookmarkTask;

  constructor(
    private router: Router,
    private bookmarkStoreService: BookmarkStoreService,
  ) {
  }

  load(): Observable<boolean> {
    return this.bookmarkStoreService.getTaskList().pipe(
      tap(value => {
        this.taskBookmarkCollection = value || [];
      }),
      switchMap(value =>
        defer(() => isEmpty(value)
          ? this.createDashboardAndSetAsCurrent().pipe(map(_ => true))
          : of(true))),
      map(_ => true)
    );
  }

  isEmpty(): boolean {
    return this.taskBookmarkCollection.filter(value => value.route !== '/').length === 0; // Dashboard always opened
  }

  getCurrent(): Bookmark {
    return this.currentBookmark;
  }

  createBookmark(bookmarkTask: IBookmarkTask): Observable<IBookmarkTask> {
    const newId = uniqueId();
    const newBookmarkTask = cloneDeep(bookmarkTask);
    newBookmarkTask.id = newId;

    const newBookmark = new Bookmark();
    newBookmark.id = newId;

    this.taskBookmarkCollection.push(newBookmarkTask);
    this.bookmarkCollection.unshift(newBookmark);

    // cut bookmarkCollection if length more than storeBookmarkBufferSize
    if (this.bookmarkCollection.length > this.bookmarkStoreService.storeBookmarkBufferSize) {
      this.bookmarkCollection.splice(
        this.bookmarkStoreService.storeBookmarkBufferSize - 1,
        this.bookmarkCollection.length - this.bookmarkStoreService.storeBookmarkBufferSize);
    }
    return this.bookmarkStoreService.setTaskList(this.taskBookmarkCollection).pipe(
      map(_ => newBookmarkTask)
    );

    //return newBookmarkTask;
  }

  deleteBookmarkById(bookmarkId: string): Observable<IBookmarkTask> {
    let index = -1;
    if (bookmarkId === this.currentId) {
      index = this.taskBookmarkCollection.findIndex(value => value.id === this.currentId);
    }
    this.taskBookmarkCollection = this.taskBookmarkCollection.filter(value => value.id !== bookmarkId);
    this.bookmarkCollection = this.bookmarkCollection.filter(x => x.id !== bookmarkId);

    return this.bookmarkStoreService.deleteBookmarkAndUpdateTasks(bookmarkId, this.taskBookmarkCollection).pipe(
      map((value) => {
        if (bookmarkId !== this.currentId) {
          index = this.taskBookmarkCollection.findIndex(item => item.id === this.currentId);
        }
        if (index >= this.taskBookmarkCollection.length) {
          index = this.taskBookmarkCollection.length - 1;
        }
        return index;
      }),
      switchMap(value =>
        defer(
          () => !isEmpty(this.taskBookmarkCollection)
            ? this.setCurrentBookmarkById(this.taskBookmarkCollection[value].id)
            : this.createDashboardAndSetAsCurrent()))
    );
  }

  deleteBookmarkAll(): Observable<IBookmarkTask> {
    this.taskBookmarkCollection = new Array<IBookmarkTask>();
    this.bookmarkCollection = new Array<Bookmark>();
    this.currentBookmark = new Bookmark();
    this.currentBookmarkTask = {};

    return this.bookmarkStoreService.deleteAllBookmarkAndTask().pipe(
      switchMap(_ => this.createDashboardAndSetAsCurrent())
    );
  }


  createDashboardAndSetAsCurrent(): Observable<IBookmarkTask> {
    const newBookmark = {
      route: '/',
      nameTranslateKey: 'COMMON.BOOKMARK.DASHBOARD.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.DASHBOARD.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.dashboard,
    };
    return this.createBookmark(newBookmark).pipe(
      switchMap(value => this.setCurrentBookmarkById(value.id))
    );
  }

  cleanCurrentCacheData() {
    const bookmark = this.currentBookmark;
    bookmark.data = {};
    bookmark.errorMessagesToDisableUpdate = null;
  }


  getCurrentBookmarkTask(): IBookmarkTask {
    return this.currentBookmarkTask;
  }

  getBookmarkTaskByBookmarkId(bookmarkId: string): IBookmarkTask {
    let bookmarkTask: IBookmarkTask;
    // search existing bookmarkTask
    if (!isNil(bookmarkId)) {
      const bookmarkTasks = this.taskBookmarkCollection.filter(value => value.id === bookmarkId);
      if (!isEmpty(bookmarkTasks)) {
        bookmarkTask = bookmarkTasks[0];
      }
    }
    return bookmarkTask;
  }

  getBookmarkTaskByTask(task: IBookmarkTask): Observable<IBookmarkTask> {
    let bookmarkTask: IBookmarkTask;
    // search existing bookmarkTask
    if (!isNil(task.id)) {
      const bookmarkTasks = this.taskBookmarkCollection.filter(value => value.id === task.id);
      if (!isEmpty(bookmarkTasks)) {
        bookmarkTask = bookmarkTasks[0];
      }
    }

    if (task.allowPinning && isNil(bookmarkTask)) {
      const bookmarkTasks = this.taskBookmarkCollection
        .filter(value => value.route === task.route && (!task.allowPinning || value.isPinned !== true));
      if (!isEmpty(bookmarkTasks)) {
        bookmarkTask = bookmarkTasks[0];
      }
    }
    return of(bookmarkTask);
  }

  getCurrentDataItem(): IBookmarkData {
    return this.currentBookmark.data;
  }

  getCurrentViewState(): IBookmarkViewState {
    return this.currentBookmark.viewState;
  }

  getCurrentId(): string {
    return this.currentId;
  }

  setCurrentId(bookmarkId: string): void {
    this.currentId = bookmarkId;
    this.currentBookmark = this.bookmarkCollection.find(x => x.id === bookmarkId);
    this.currentBookmarkTask = this.taskBookmarkCollection.find(value => value.id === bookmarkId);
  }

  setCurrentBookmarkById(bookmarkId: string): Observable<IBookmarkTask> {
    return this.returnBookmarkById(bookmarkId).pipe(
      map(value => {
        this.currentId = bookmarkId;
        this.currentBookmark = value;
        this.currentBookmarkTask = this.taskBookmarkCollection.find(item => item.id === bookmarkId);
        return this.currentBookmarkTask;
      }),
    );
  }

  getCurrentDataViewState(name: string): any {
    const itemDataViewState = this.currentBookmark.dataViewState.get(name);
    if (!itemDataViewState) {
      this.setCurrentDataViewState(name, {});
    }
    return this.currentBookmark.dataViewState.get(name);
  }

  setCurrentDataViewState(name: string, obj: any) {
    this.currentBookmark.dataViewState.set(name, obj);
  }

  deleteCurrentDataViewState(name: string): any {
    this.currentBookmark.dataViewState.delete(name);
  }

  save(): Observable<any> {
    return forkJoin({
      bookmark: this.bookmarkStoreService.setBookmark(this.currentBookmark),
      tasks: this.bookmarkStoreService.setTaskList(this.taskBookmarkCollection)
    });
  }

  restoreScrollPosition(): void {
    // block writing information about scroll to bookmark
    this.currentBookmark.popupTab.scrollBlock = true;

    // get current popup and scroll position / host height
    const activeIndexTab = this.currentBookmark.popupTab.activeTabIndex;
    const restoredContentHeight = this.getCurrent().popupTab.tabs[activeIndexTab].contentElementHeight ?? 0;
    const scrollOffset = this.getCurrent().popupTab.tabs[activeIndexTab].scrollPositionOffset ?? 0;

    // get current host (latest on content container)
    const contents = document.querySelectorAll('[id=content]');
    const content = contents[contents.length - 1];
    const host: any = content.children[content.children.length - 1];

    // set host el visible for js
    host.style.display = 'block';

    // console.log('Selected host name:', host.tagName);

    const restoreScrollPositionHandler = () => {
      content.scroll({
        top: scrollOffset,
        //behavior: 'smooth'
      });

      // unblock writing information about scroll to bookmark
      this.currentBookmark.popupTab.scrollBlock = false;

      // console.log(`${this.currentBookmark.id} RESTORED: offset - ${scrollOffset}, height - ${restoredContentHeight}`);
    };

    // get information about height of host
    const observer = new ResizeObserver(() => {
      // calculate average height of host
      const coefficient = 0.1; // +- 10%
      const contentScrollHeight = content.scrollHeight;
      const minContentScrollHeight = contentScrollHeight - (contentScrollHeight * coefficient);
      const maxContentScrollHeight = contentScrollHeight + (contentScrollHeight * coefficient);

      // when all of host content are expanded - apply scroll position
      if (restoredContentHeight >= minContentScrollHeight && restoredContentHeight <= maxContentScrollHeight) {
        observer.disconnect();
        restoreScrollPositionHandler();
      }
    });

    observer.observe(host);

    restoreScrollPositionHandler();
  }

  private returnBookmarkById(bookmarkId: string): Observable<Bookmark> {
    const bookmarkIndexInCache = this.bookmarkCollection.findIndex(x => x.id === bookmarkId);
    if (bookmarkIndexInCache !== -1) {
      const tmpBookmark = this.bookmarkCollection[bookmarkIndexInCache];

      // move bookmark to the front
      if (bookmarkIndexInCache > 0) {
        this.bookmarkCollection.splice(bookmarkIndexInCache, 1);
        this.bookmarkCollection.unshift(tmpBookmark);
      }
      return of(tmpBookmark);
    } else {
      return this.bookmarkStoreService.getBookmark(bookmarkId).pipe(
        map(value => {

          if (isNil(value)) {
            value = new Bookmark();
            value.id = bookmarkId;
          }
          this.bookmarkCollection.unshift(value);

          // cut bookmarkCollection if length more than storeBookmarkBufferSize
          if (this.bookmarkCollection.length > this.bookmarkStoreService.storeBookmarkBufferSize) {
            this.bookmarkCollection.splice(
              this.bookmarkStoreService.storeBookmarkBufferSize - 1,
              this.bookmarkCollection.length - this.bookmarkStoreService.storeBookmarkBufferSize);
          }
          return value;
        })
      );
    }
  }
}
