import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {DepartmentApiService} from './department-api.service';
import {DepartmentMapperService} from './department-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {IDepartmentListViewModel} from '../types/view-model/department-list-view-model';
import {IDepartmentViewModel} from '../types/view-model/department-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IDepartmentFilterViewModel} from '../types/view-model/department-filter-view-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {IDepartmentDetailsViewState} from '../types/view-model/department-details-view-state';

@Injectable({
  providedIn: 'root'
})
export class DepartmentFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private departmentMapperService: DepartmentMapperService,
    private departmentApiService: DepartmentApiService,
  ) {
  }

  //region Commission

  public getViewStateDepartmentListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().departmentListPaginator)) {
      this.bookmarkService.getCurrentViewState().departmentListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().departmentListPaginator);
  }

  public getViewStateDepartmentFilter$(): Observable<IDepartmentFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().departmentFilter)) {
      this.bookmarkService.getCurrentViewState().departmentFilter = this.departmentMapperService
        .departmentInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().departmentFilter);
  }

  public getDepartmentList$(paginator: IPaginatorBase, filter: IDepartmentFilterViewModel):
    Observable<IPaginator<IDepartmentListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().departmentList) {
      return of(this.bookmarkService.getCurrentDataItem().departmentList);
    } else {
      return this.loadDepartmentList$(paginator, filter);
    }
  }

  public loadDepartmentList$(paginator: IPaginatorBase, filter: IDepartmentFilterViewModel):
    Observable<IPaginator<IDepartmentListViewModel>> {
    const filterModel = this.departmentMapperService.departmentFilterViewModelToModel(filter);
    return this.departmentApiService.getDepartmentList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.departmentMapperService.departmentListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().departmentList = value),
    );
  }

  public getDepartment$(id: number): Observable<IDepartmentViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().departmentDetail) {
      return of(this.bookmarkService.getCurrentDataItem().departmentDetail);
    } else {
      return this.loadDepartment$(id);
    }
  }

  public loadDepartment$(id: number): Observable<IDepartmentViewModel> {
    return this.departmentApiService.getDepartment$(id)
      .pipe(
        map(value => this.departmentMapperService.departmentGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().departmentDetail = value;
          this.bookmarkService.getCurrentDataItem().departmentDetailCopy = cloneDeep(value);
        })
      );
  }

  public createDepartment$(department: IDepartmentViewModel): Observable<IdSimpleItem> {
    return this.departmentApiService.createDepartment$(this.departmentMapperService.departmentViewModelToPostModel(department))
      .pipe(map(value => value.data));
  }

  public updateDepartment$(department: IDepartmentViewModel): Observable<IDepartmentViewModel> {
    return this.departmentApiService.updateDepartment$(this.departmentMapperService.departmentViewModelToPutModel(department))
      .pipe(
        map(value => this.departmentMapperService.departmentGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().commissionDetail = value;
          this.bookmarkService.getCurrentDataItem().commissionDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteDepartment$(department: IDepartmentViewModel): Observable<IdSimpleItem> {
    return this.departmentApiService.deleteDepartment$(department.id, department.guid).pipe(map(resp => resp.data));
  }

  public getDepartmentDetailsViewState$(): Observable<IDepartmentDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().departmentDetails)) {
      this.bookmarkService.getCurrentViewState().departmentDetails = this.departmentMapperService
        .departmentInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().departmentDetails);
  }

  // endregion

  // region Department teachers

  public getViewStateDepartmentTeachersListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().departmentTeachersListPaginator)) {
      this.bookmarkService.getCurrentViewState().departmentTeachersListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().departmentTeachersListPaginator);
  }

  public getDepartmentTeachersList$(paginator: IPaginatorBase, commission: IDepartmentViewModel):
    Observable<IPaginator<IdNameSimpleItem>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().departmentTeachersList)) {
      return of(this.bookmarkService.getCurrentDataItem().departmentTeachersList);
    } else {
      return this.loadDepartmentTeachersList$(paginator, commission);
    }
  }

  public loadDepartmentTeachersList$(paginator: IPaginatorBase, commission: IDepartmentViewModel):
    Observable<IPaginator<IdNameSimpleItem>> {
    const filter = this.departmentMapperService.departmentViewModelToCommissionTeachersFilterModel(commission);
    return this.departmentApiService.getDepartmentTeachersList$(paginator, filter)
      .pipe(
        map(resp => cloneDeep(resp.data)),
        tap(resp => this.bookmarkService.getCurrentDataItem().departmentTeachersList = resp)
      );
  }

  // endregion
}
