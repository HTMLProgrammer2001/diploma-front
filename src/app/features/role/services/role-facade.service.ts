import {Injectable, Injector} from '@angular/core';
import {Observable, of} from 'rxjs';
import {PaginatorRequest} from '../../../shared/types/paginator-request';
import {BookmarkService} from '../../../global/services/bookmark.service';
import {ConfigService} from '../../../global/services/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {RoleListViewModel} from '../types/view-model/role-list-view-model';
import {RoleApiService} from './role-api.service';
import {RoleMapperService} from './role-mapper.service';
import {IResponse} from '../../../shared/types/response';
import {convertToIResponse} from '../../../shared/utils';
import {cloneDeep} from 'lodash';
import {RoleDetailsViewModel} from '../types/view-model/role-details-view-model';

@Injectable({
  providedIn: 'root'
})
export class RoleFacadeService {

  constructor(
    private injector: Injector,
    private roleMapperService: RoleMapperService,
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
  ) { }

  private _roleApiService: RoleApiService;

  public get roleApiService(): RoleApiService {
    if (!this._roleApiService) {
      this._roleApiService = this.injector.get(RoleApiService);
    }
    return this._roleApiService;
  }

  getViewStateRoleListPaginator$(): Observable<PaginatorRequest> {
    if (!this.bookmarkService.getCurrentViewState().adminRoleListPaginator) {
      this.bookmarkService.getCurrentViewState().adminRoleListPaginator = {
        size: String(this.configService.getConfig().pagingGridBigSize),
        page: String(this.configService.getConfig().pagingGridBigPage),
      };
    }
    return of(this.bookmarkService.getCurrentViewState().adminRoleListPaginator);
  }

  getRoleList$(paginator: PaginatorRequest): Observable<IPaginator<RoleListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().adminRoleList) {
      return of(this.bookmarkService.getCurrentDataItem().adminRoleList);
    } else {
      return this.loadRoleList$(paginator);
    }
  }

  loadRoleList$(paginator: PaginatorRequest): Observable<IPaginator<RoleListViewModel>> {
    return this.roleApiService.roleList$(paginator).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.roleMapperService.roleToListViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().adminRoleList = value),
    );
  }

  public getRole$(id: number): Observable<IResponse<RoleDetailsViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().roleUserDetail) {
      return of(convertToIResponse<RoleDetailsViewModel>(this.bookmarkService.getCurrentDataItem().roleUserDetail));
    } else {
      return this.loadRole$(id);
    }
  }

  public loadRole$(id: number): Observable<IResponse<RoleDetailsViewModel>> {
    return this.roleApiService.getRole$(id)
      .pipe(
        map(value => ({
          ...value,
          data: this.roleMapperService.roleGetModelToViewModel(value.data)
        })),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().roleUserDetail = value.data;
          this.bookmarkService.getCurrentDataItem().roleUserDetailCopy = cloneDeep(value.data);
        })
      );
  }

  public createRole$(role: RoleDetailsViewModel): Observable<IResponse<RoleDetailsViewModel>> {
    return this.roleApiService.createRole$(this.roleMapperService.roleViewModelToPostModel(role))
      .pipe(
        map(value => ({
          ...value,
          data: this.roleMapperService.roleGetModelToViewModel(value.data)
        }))
      );
  }

  public updateRole$(role: RoleDetailsViewModel): Observable<IResponse<RoleDetailsViewModel>> {
    return this.roleApiService.updateRole$(role.id, this.roleMapperService.roleViewModelToPutModel(role))
      .pipe(
        map(value => ({
          ...value,
          data: this.roleMapperService.roleGetModelToViewModel(value.data)
        })),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().roleUserDetail = value.data;
          this.bookmarkService.getCurrentDataItem().roleUserDetailCopy = cloneDeep(value.data);
        })
      );
  }

  public deleteRole$(userId: number): Observable<IResponse<string>> {
    return this.roleApiService.deleteRole$(userId);
  }
}
