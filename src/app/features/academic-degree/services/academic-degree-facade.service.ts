import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {AcademicDegreeApiService} from './academic-degree-api.service';
import {AcademicDegreeMapperService} from './academic-degree-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {IAcademicDegreeListViewModel} from '../types/view-model/academic-degree-list-view-model';
import {IAcademicDegreeViewModel} from '../types/view-model/academic-degree-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IAcademicDegreeFilterViewModel} from '../types/view-model/academic-degree-filter-view-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {IAcademicDegreeDetailsViewState} from '../types/view-model/academic-degree-details-view-state';

@Injectable({
  providedIn: 'root'
})
export class AcademicDegreeFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private academicDegreeMapperService: AcademicDegreeMapperService,
    private academicDegreeApiService: AcademicDegreeApiService,
  ) {
  }

  //region Commission

  public getViewStateAcademicDegreeListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().academicDegreeListPaginator)) {
      this.bookmarkService.getCurrentViewState().academicDegreeListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().academicDegreeListPaginator);
  }

  public getViewStateAcademicDegreeFilter$(): Observable<IAcademicDegreeFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().academicDegreeFilter)) {
      this.bookmarkService.getCurrentViewState().academicDegreeFilter = this.academicDegreeMapperService
        .academicDegreeInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().academicDegreeFilter);
  }

  public getAcademicDegreeList$(paginator: IPaginatorBase, filter: IAcademicDegreeFilterViewModel):
    Observable<IPaginator<IAcademicDegreeListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().academicDegreeList) {
      return of(this.bookmarkService.getCurrentDataItem().academicDegreeList);
    } else {
      return this.loadAcademicDegreeList$(paginator, filter);
    }
  }

  public loadAcademicDegreeList$(paginator: IPaginatorBase, filter: IAcademicDegreeFilterViewModel):
    Observable<IPaginator<IAcademicDegreeListViewModel>> {
    const filterModel = this.academicDegreeMapperService.academicDegreeFilterViewModelToModel(filter);
    return this.academicDegreeApiService.getAcademicDegreeList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.academicDegreeMapperService.academicDegreeListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().academicDegreeList = value),
    );
  }

  public getAcademicDegree$(id: number): Observable<IAcademicDegreeViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().academicDegreeDetail) {
      return of(this.bookmarkService.getCurrentDataItem().academicDegreeDetail);
    } else {
      return this.loadAcademicDegree$(id);
    }
  }

  public loadAcademicDegree$(id: number): Observable<IAcademicDegreeViewModel> {
    return this.academicDegreeApiService.getAcademicDegree$(id)
      .pipe(
        map(value => this.academicDegreeMapperService.academicDegreeGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().academicDegreeDetail = value;
          this.bookmarkService.getCurrentDataItem().academicDegreeDetailCopy = cloneDeep(value);
        })
      );
  }

  public createAcademicDegree$(department: IAcademicDegreeViewModel): Observable<IdSimpleItem> {
    const body = this.academicDegreeMapperService.academicDegreeViewModelToPostModel(department);
    return this.academicDegreeApiService.createAcademicDegree$(body)
      .pipe(map(value => value.data));
  }

  public updateAcademicDegree$(department: IAcademicDegreeViewModel): Observable<IAcademicDegreeViewModel> {
    const body = this.academicDegreeMapperService.academicDegreeViewModelToPutModel(department);
    return this.academicDegreeApiService.updateAcademicDegree$(body)
      .pipe(
        map(value => this.academicDegreeMapperService.academicDegreeGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().academicDegreeDetail = value;
          this.bookmarkService.getCurrentDataItem().academicDegreeDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteAcademicDegree$(department: IAcademicDegreeViewModel): Observable<IdSimpleItem> {
    return this.academicDegreeApiService.deleteAcademicDegree$(department.id, department.guid).pipe(map(resp => resp.data));
  }

  public getAcademicDegreeDetailsViewState$(): Observable<IAcademicDegreeDetailsViewState> {
    if(isNil(this.bookmarkService.getCurrentViewState().academicDegreeDetails)) {
      this.bookmarkService.getCurrentViewState().academicDegreeDetails = this.academicDegreeMapperService
        .academicDegreeInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().academicDegreeDetails);
  }

  // endregion

  // region Academic degree teachers

  public getViewStateAcademicDegreeTeachersListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().academicDegreeTeachersListPaginator)) {
      this.bookmarkService.getCurrentViewState().academicDegreeTeachersListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().academicDegreeTeachersListPaginator);
  }

  public getAcademicDegreeTeachersList$(paginator: IPaginatorBase, commission: IAcademicDegreeViewModel):
    Observable<IPaginator<IdNameSimpleItem>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().academicDegreeTeachersList)) {
      return of(this.bookmarkService.getCurrentDataItem().academicDegreeTeachersList);
    } else {
      return this.loadAcademicDegreeTeachersList$(paginator, commission);
    }
  }

  public loadAcademicDegreeTeachersList$(paginator: IPaginatorBase, commission: IAcademicDegreeViewModel):
    Observable<IPaginator<IdNameSimpleItem>> {
    const filter = this.academicDegreeMapperService.academicDegreeViewModelToCommissionTeachersFilterModel(commission);
    return this.academicDegreeApiService.getAcademicDegreeTeachersList$(paginator, filter)
      .pipe(
        map(resp => cloneDeep(resp.data)),
        tap(resp => this.bookmarkService.getCurrentDataItem().academicDegreeTeachersList = resp)
      );
  }

  // endregion
}
