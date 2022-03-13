import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark.service';
import {ConfigService} from '../../../global/services/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {CommissionApiService} from './commission-api.service';
import {CommissionMapperService} from './commission-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {ICommissionListViewModel} from '../types/view-model/commission-list-view-model';
import {ICommissionViewModel} from '../types/view-model/commission-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {ICommissionFilterViewModel} from '../types/view-model/commission-filter-view-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({
  providedIn: 'root'
})
export class CommissionFacadeService {

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private commissionMapperService: CommissionMapperService,
    private commissionApiService: CommissionApiService,
  ) {
  }

  //region Commission

  public getViewStateCommissionListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().commissionListPaginator)) {
      this.bookmarkService.getCurrentViewState().commissionListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().commissionListPaginator);
  }

  public getViewStateCommissionFilter$(): Observable<ICommissionFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().commissionFilter)) {
      this.bookmarkService.getCurrentViewState().commissionFilter = this.commissionMapperService
        .commissionInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().commissionFilter);
  }

  public getCommissionList$(paginator: IPaginatorBase, filter: ICommissionFilterViewModel):
    Observable<IPaginator<ICommissionListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().commissionList) {
      return of(this.bookmarkService.getCurrentDataItem().commissionList);
    } else {
      return this.loadCommissionList$(paginator, filter);
    }
  }

  public loadCommissionList$(paginator: IPaginatorBase, filter: ICommissionFilterViewModel):
    Observable<IPaginator<ICommissionListViewModel>> {
    const filterModel = this.commissionMapperService.commissionFilterViewModelToModel(filter);
    return this.commissionApiService.getCommissionList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.commissionMapperService.commissionListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().commissionList = value),
    );
  }

  public getCommission$(id: number): Observable<ICommissionViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().commissionDetail) {
      return of(this.bookmarkService.getCurrentDataItem().commissionDetail);
    } else {
      return this.loadCommission$(id);
    }
  }

  public loadCommission$(id: number): Observable<ICommissionViewModel> {
    return this.commissionApiService.getCommission$(id)
      .pipe(
        map(value => this.commissionMapperService.commissionGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().commissionDetail = value;
          this.bookmarkService.getCurrentDataItem().commissionDetailCopy = cloneDeep(value);
        })
      );
  }

  public createCommission$(role: ICommissionViewModel): Observable<IdSimpleItem> {
    return this.commissionApiService.createCommission$(this.commissionMapperService.commissionViewModelToPostModel(role))
      .pipe(map(value => value.data));
  }

  public updateCommission$(role: ICommissionViewModel): Observable<ICommissionViewModel> {
    return this.commissionApiService.updateCommission$(this.commissionMapperService.commissionViewModelToPutModel(role))
      .pipe(
        map(value => this.commissionMapperService.commissionGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().commissionDetail = value;
          this.bookmarkService.getCurrentDataItem().commissionDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteCommission$(commission: ICommissionViewModel): Observable<IdSimpleItem> {
    return this.commissionApiService.deleteCommission$(commission.id, commission.guid).pipe(map(resp => resp.data));
  }

  // endregion

  // region Commission teachers

  public getViewStateCommissionTeachersListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().commissionTeachersListPaginator)) {
      this.bookmarkService.getCurrentViewState().commissionTeachersListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().commissionTeachersListPaginator);
  }

  public getCommissionTeachersList$(paginator: IPaginatorBase, commission: ICommissionViewModel):
    Observable<IPaginator<IdNameSimpleItem>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().commissionTeachersList)) {
      return of(this.bookmarkService.getCurrentDataItem().commissionTeachersList);
    } else {
      return this.loadCommissionTeachersList$(paginator, commission);
    }
  }

  public loadCommissionTeachersList$(paginator: IPaginatorBase, commission: ICommissionViewModel):
    Observable<IPaginator<IdNameSimpleItem>> {
    const filter = this.commissionMapperService.commissionViewModelToCommissionTeachersFilterModel(commission);
    return this.commissionApiService.getCommissionTeachersList$(paginator, filter)
      .pipe(
        map(resp => resp.data),
        tap(resp => this.bookmarkService.getCurrentDataItem().commissionTeachersList = resp)
      );
  }

  // endregion
}
