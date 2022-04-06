import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {UserApiService} from './user-api.service';
import {UserMapperService} from './user-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {IUserListViewModel} from '../types/view-model/user-list-view-model';
import {IUserViewModel} from '../types/view-model/user-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IUserFilterViewModel} from '../types/view-model/user-filter-view-model';
import {IUserDetailsViewState} from '../types/view-model/user-details-view-state';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({
  providedIn: 'root'
})
export class UserFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private userMapperService: UserMapperService,
    private userApiService: UserApiService,
  ) {
  }

  //region User

  public getViewStateUserListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().userListPaginator)) {
      this.bookmarkService.getCurrentViewState().userListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().userListPaginator);
  }

  public getViewStateUserFilter$(): Observable<IUserFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().userFilter)) {
      this.bookmarkService.getCurrentViewState().userFilter = this.userMapperService
        .userInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().userFilter);
  }

  public getUserList$(paginator: IPaginatorBase, filter: IUserFilterViewModel): Observable<IPaginator<IUserListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().userList) {
      return of(this.bookmarkService.getCurrentDataItem().userList);
    } else {
      return this.loadUserList$(paginator, filter);
    }
  }

  public loadUserList$(paginator: IPaginatorBase, filter: IUserFilterViewModel): Observable<IPaginator<IUserListViewModel>> {
    const filterModel = this.userMapperService.userFilterViewModelToModel(filter);
    return this.userApiService.getUserList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.userMapperService.userListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().userList = value),
    );
  }

  public getUser$(id: number): Observable<IUserViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().userDetail) {
      return of(this.bookmarkService.getCurrentDataItem().userDetail);
    } else {
      return this.loadUser$(id);
    }
  }

  public loadUser$(id: number): Observable<IUserViewModel> {
    return this.userApiService.getUser$(id)
      .pipe(
        map(value => this.userMapperService.userGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().userDetail = value;
          this.bookmarkService.getCurrentDataItem().userDetailCopy = cloneDeep(value);
        })
      );
  }

  public createUser$(user: IUserViewModel): Observable<IdSimpleItem> {
    const body = this.userMapperService.userViewModelToPostModel(user);
    return this.userApiService.createUser$(body).pipe(map(value => value.data));
  }

  public updateUser$(user: IUserViewModel): Observable<IUserViewModel> {
    const body = this.userMapperService.userViewModelToPutModel(user);
    return this.userApiService.updateUser$(body)
      .pipe(
        map(value => this.userMapperService.userGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().userDetail = value;
          this.bookmarkService.getCurrentDataItem().userDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteUser$(user: IUserViewModel): Observable<IdSimpleItem> {
    return this.userApiService.deleteUser$(user.id, user.guid).pipe(map(resp => resp.data));
  }

  public getUserDetailsViewState$(): Observable<IUserDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().userDetails)) {
      this.bookmarkService.getCurrentViewState().userDetails = this.userMapperService
        .userInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().userDetails);
  }

  // endregion

  // region User dropdowns

  public getRoleDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.userApiService.getRoleDropdown$(paginator).pipe(map(resp => resp.data));
  }

  public getRoleDropdownItem$(id: number): Observable<IdNameSimpleItem> {
    return this.userApiService.getRoleDropdownItem$(id).pipe(map(resp => resp.data));
  }

  // endregion
}
