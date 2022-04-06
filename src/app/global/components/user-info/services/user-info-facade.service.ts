import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {UserInfoApiService} from './user-info-api.service';
import {IUserInfoProfileGetModel} from '../types/user-info-profile-get-model';
import {BookmarkService} from '../../../services/bookmark/bookmark.service';
import {isNil} from 'lodash';
import {map, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserInfoFacadeService {
  public userProfileInfo$ = new Subject<IUserInfoProfileGetModel>();

  constructor(
    private userInfoApiService: UserInfoApiService,
    private bookmarkService: BookmarkService,
  ) {
  }

  public getUserInfo$(): Observable<IUserInfoProfileGetModel> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().userInfo)) {
      return of(this.bookmarkService.getCurrentDataItem().userInfo);
    } else {
      return this.loadUserInfo$().pipe(tap(resp => this.bookmarkService.getCurrentDataItem().userInfo = resp));
    }
  }

  public loadUserInfo$(): Observable<IUserInfoProfileGetModel> {
    return this.userInfoApiService.getProfile$().pipe(map(resp => resp.data));
  }
}
