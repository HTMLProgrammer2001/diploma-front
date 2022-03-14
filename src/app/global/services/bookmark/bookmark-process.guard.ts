import {Injectable} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import {defer, Observable, of} from 'rxjs';
import {isNil} from 'lodash';
import {BookmarkService} from './bookmark.service';
import {map, switchMap} from 'rxjs/operators';
import {IBookmarkTask} from '../../types/bookmark/bookmark-task';

@Injectable({
  providedIn: 'root'
})
export class BookmarkProcessGuard implements CanActivate, CanDeactivate<unknown> {
  constructor(protected bookmarkService: BookmarkService,
              protected route: ActivatedRoute) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const bookmarkTaskSettings: IBookmarkTask = {
      id: route.queryParamMap.get('bookmarkId'),
      route: state.url.split('?')[0],
      allowPinning: route.data.allowPinning as boolean,
      params: {...route.queryParams}
    };

    return this.bookmarkService.getBookmarkTaskByTask(bookmarkTaskSettings).pipe(
      switchMap(value =>
        defer(() => {
            if (isNil(value)) {
              return this.bookmarkService.createBookmark(bookmarkTaskSettings);
            } else {
              value.params = route.queryParams;
              return of(value);
            }
          }
        )
      ),
      switchMap(value => this.bookmarkService.setCurrentBookmarkById(value.id)),
      map(_ => true)
    );
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // calculate is data changed
    const currentTask = this.bookmarkService.getCurrentBookmarkTask();
    if (!isNil(currentTask)) {
      if (!isNil(currentTask.checkDataChanged)) {
        currentTask.isDataChanged = currentTask.checkDataChanged();
      }
      currentTask.checkDataChanged = null;
    }
    return this.bookmarkService.save().pipe(map(_ => true));
  }
}
