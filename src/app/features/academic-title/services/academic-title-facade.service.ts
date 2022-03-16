import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {AcademicTitleApiService} from './academic-title-api.service';
import {AcademicTitleMapperService} from './academic-title-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {IAcademicTitleListViewModel} from '../types/view-model/academic-title-list-view-model';
import {IAcademicTitleViewModel} from '../types/view-model/academic-title-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IAcademicTitleFilterViewModel} from '../types/view-model/academic-title-filter-view-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {IAcademicTitleDetailsViewState} from '../types/view-model/academic-title-details-view-state';

@Injectable({
  providedIn: 'root'
})
export class AcademicTitleFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private academicTitleMapperService: AcademicTitleMapperService,
    private academicTitleApiService: AcademicTitleApiService,
  ) {
  }

  //region Academic title

  public getViewStateAcademicTitleListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().academicTitleListPaginator)) {
      this.bookmarkService.getCurrentViewState().academicTitleListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().academicTitleListPaginator);
  }

  public getViewStateAcademicTitleFilter$(): Observable<IAcademicTitleFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().academicTitleFilter)) {
      this.bookmarkService.getCurrentViewState().academicTitleFilter = this.academicTitleMapperService
        .academicTitleInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().academicTitleFilter);
  }

  public getAcademicTitleList$(paginator: IPaginatorBase, filter: IAcademicTitleFilterViewModel):
    Observable<IPaginator<IAcademicTitleListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().academicTitleList) {
      return of(this.bookmarkService.getCurrentDataItem().academicTitleList);
    } else {
      return this.loadAcademicTitleList$(paginator, filter);
    }
  }

  public loadAcademicTitleList$(paginator: IPaginatorBase, filter: IAcademicTitleFilterViewModel):
    Observable<IPaginator<IAcademicTitleListViewModel>> {
    const filterModel = this.academicTitleMapperService.academicTitleFilterViewModelToModel(filter);
    return this.academicTitleApiService.getAcademicTitleList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.academicTitleMapperService
          .academicTitleListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().academicTitleList = value),
    );
  }

  public getAcademicTitle$(id: number): Observable<IAcademicTitleViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().academicTitleDetail) {
      return of(this.bookmarkService.getCurrentDataItem().academicTitleDetail);
    } else {
      return this.loadAcademicTitle$(id);
    }
  }

  public loadAcademicTitle$(id: number): Observable<IAcademicTitleViewModel> {
    return this.academicTitleApiService.getAcademicTitle$(id)
      .pipe(
        map(value => this.academicTitleMapperService.academicTitleGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().academicTitleDetail = value;
          this.bookmarkService.getCurrentDataItem().academicTitleDetailCopy = cloneDeep(value);
        })
      );
  }

  public createAcademicTitle$(academicTitle: IAcademicTitleViewModel): Observable<IdSimpleItem> {
    const body = this.academicTitleMapperService.academicTitleViewModelToPostModel(academicTitle);
    return this.academicTitleApiService.createAcademicTitle$(body)
      .pipe(map(value => value.data));
  }

  public updateAcademicTitle$(academicTitle: IAcademicTitleViewModel): Observable<IAcademicTitleViewModel> {
    const body = this.academicTitleMapperService.academicTitleViewModelToPutModel(academicTitle);
    return this.academicTitleApiService.updateAcademicTitle$(body)
      .pipe(
        map(value => this.academicTitleMapperService.academicTitleGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().academicTitleDetail = value;
          this.bookmarkService.getCurrentDataItem().academicTitleDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteAcademicTitle$(academicTitle: IAcademicTitleViewModel): Observable<IdSimpleItem> {
    return this.academicTitleApiService.deleteAcademicTitle$(academicTitle.id, academicTitle.guid)
      .pipe(map(resp => resp.data));
  }

  public getAcademicTitleDetailsViewState$(): Observable<IAcademicTitleDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().academicTitleDetails)) {
      this.bookmarkService.getCurrentViewState().academicTitleDetails = this.academicTitleMapperService
        .academicTitleInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().academicTitleDetails);
  }

  // endregion

  // region Academic title teachers

  public getViewStateAcademicTitleTeachersListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().academicTitleTeachersListPaginator)) {
      this.bookmarkService.getCurrentViewState().academicTitleTeachersListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().academicTitleTeachersListPaginator);
  }

  public getAcademicTitleTeachersList$(paginator: IPaginatorBase, academicTitle: IAcademicTitleViewModel):
    Observable<IPaginator<IdNameSimpleItem>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().academicTitleTeachersList)) {
      return of(this.bookmarkService.getCurrentDataItem().academicTitleTeachersList);
    } else {
      return this.loadAcademicTitleTeachersList$(paginator, academicTitle);
    }
  }

  public loadAcademicTitleTeachersList$(paginator: IPaginatorBase, academicTitle: IAcademicTitleViewModel):
    Observable<IPaginator<IdNameSimpleItem>> {
    const filter = this.academicTitleMapperService.academicTitleViewModelToTeachersFilterModel(academicTitle);
    return this.academicTitleApiService.getAcademicTitleTeachersList$(paginator, filter)
      .pipe(
        map(resp => cloneDeep(resp.data)),
        tap(resp => this.bookmarkService.getCurrentDataItem().academicTitleTeachersList = resp)
      );
  }

  // endregion
}
