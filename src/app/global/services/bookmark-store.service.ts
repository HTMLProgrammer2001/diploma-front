import {Injectable} from '@angular/core';
import {Driver, NgForage} from 'ngforage';
import {Bookmark} from '../types/bookmark';
import {IBookmarkTask} from '../types/bookmark-task';
import {forkJoin, from, Observable} from 'rxjs';
import {cloneDeep} from 'lodash';
import {map} from 'rxjs/operators';
import {IBookmarkViewState} from '../types/bookmark-view-state';
import {clearSerializeObject} from '../../shared/utils';
import {SessionService} from './session.service';
import {ConfigService} from './config.service';

@Injectable({providedIn: 'root'})
export class BookmarkStoreService {
  /** task storage instance  **/
  private taskStore: NgForage;
  /** bookmark storage instance  **/
  private bookmarkStore: NgForage;
  private taskStoreKey = 'tasks';
  /** todo: config from config.json **/
  public storeBookmarkBufferSize;
  public currentSessionId: string;

  constructor(
    private ngf: NgForage,
    private sessionService: SessionService,
    private configService: ConfigService
  ) {
    //debugger
    this.initStorage();
    this.storeBookmarkBufferSize = this.configService.getConfig().storeBookmarkBufferSize;
  }

  /**
   * Set task list to store
   *
   * @param tasks
   */
  public setTaskList(tasks: Array<IBookmarkTask>): Observable<IBookmarkTask[]> {
    this.sessionService.extendCurrentSessionExpirationTime();
    tasks = cloneDeep(tasks);
    tasks.forEach(value => {
      if (value.checkDataChanged) {
        value.isDataChanged = value.checkDataChanged();
        value.checkDataChanged = null;
      }
    });
    return from(this.taskStore.setItem<Array<IBookmarkTask>>(this.taskStoreKey, tasks));
  }

  /**
   * Set bookmark to store
   *
   * @param bookmark
   */
  public setBookmark(bookmark: Bookmark): Observable<Bookmark> {
    bookmark = cloneDeep(bookmark);
    bookmark.viewState = clearSerializeObject<IBookmarkViewState>(bookmark.viewState);

    return from(this.bookmarkStore.setItem<Bookmark>(bookmark.id, bookmark));
  }

  /**
   * Get task list from store
   */
  public getTaskList(): Observable<IBookmarkTask[]> {
    return from(this.taskStore.getItem<Array<IBookmarkTask>>(this.taskStoreKey));
  }

  /**
   * Get bookmark list from store
   */
  public getBookmark(bookmarkId: string): Observable<Bookmark> {
    return from(this.bookmarkStore.getItem<Bookmark>(bookmarkId));

  }

  /**
   * Delete all bookmarks and tasks from store
   */
  public deleteAllBookmarkAndTask(): Observable<boolean> {
    return forkJoin({
      tasks: from(this.taskStore.setItem(this.taskStoreKey, [])),
      bookmarks: from(this.bookmarkStore.clear())
    }).pipe(map(_ => true));
  }

  /**
   * Delete all bookmarks from store
   */
  public deleteAllBookmarks(): Observable<boolean> {
    return from(this.bookmarkStore.clear()).pipe(map(_ => true));
  }

  /**
   * Delete task and bookmark from store by ID and update tasks
   *
   * @param bookmarkId
   * @param tasks
   */
  public deleteBookmarkAndUpdateTasks(bookmarkId: string, tasks: Array<IBookmarkTask>): Observable<boolean> {
    return forkJoin({
      tasks: this.setTaskList(tasks),
      bookmarks: this.deleteBookmarkById(bookmarkId),
    }).pipe(map(_ => true));
  }

  /**
   * Delete bookmark from store by ID
   *
   * @param id
   */
  public deleteBookmarkById(id: string): Observable<void> {
    return from(this.bookmarkStore.removeItem(id));
  }

  /**
   * Create storage instance
   *
   * @private
   */
  private initStorage(): void {
    // current session id
    const session = this.sessionService.currentSessionId;
    this.currentSessionId = this.sessionService.currentSessionId;
    this.taskStore = this.ngf.clone({
      name: `bookmarks_${session}`,
      storeName: `tasks`,
      driver: [Driver.INDEXED_DB]
    });

    this.bookmarkStore = this.ngf.clone({
      name: `bookmarks_${session}`,
      storeName: `bookmarks`,
      driver: [Driver.INDEXED_DB]
    });
  }
}
