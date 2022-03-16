import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {TeachingRankApiService} from './teaching-rank-api.service';
import {TeachingRankMapperService} from './teaching-rank-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {ITeachingRankListViewModel} from '../types/view-model/teaching-rank-list-view-model';
import {ITeachingRankViewModel} from '../types/view-model/teaching-rank-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {ITeachingRankFilterViewModel} from '../types/view-model/teaching-rank-filter-view-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {ITeachingRankDetailsViewState} from '../types/view-model/teaching-rank-details-view-state';

@Injectable({
  providedIn: 'root'
})
export class TeachingRankFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private teachingRankMapperService: TeachingRankMapperService,
    private teachingRankApiService: TeachingRankApiService,
  ) {
  }

  //region Teaching rank

  public getViewStateTeachingRankListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().teachingRankListPaginator)) {
      this.bookmarkService.getCurrentViewState().teachingRankListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().teachingRankListPaginator);
  }

  public getViewStateTeachingRankFilter$(): Observable<ITeachingRankFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().teachingRankFilter)) {
      this.bookmarkService.getCurrentViewState().teachingRankFilter = this.teachingRankMapperService
        .teachingRankInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().teachingRankFilter);
  }

  public getTeachingRankList$(paginator: IPaginatorBase, filter: ITeachingRankFilterViewModel):
    Observable<IPaginator<ITeachingRankListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().teachingRankList) {
      return of(this.bookmarkService.getCurrentDataItem().teachingRankList);
    } else {
      return this.loadTeachingRankList$(paginator, filter);
    }
  }

  public loadTeachingRankList$(paginator: IPaginatorBase, filter: ITeachingRankFilterViewModel):
    Observable<IPaginator<ITeachingRankListViewModel>> {
    const filterModel = this.teachingRankMapperService.teachingRankFilterViewModelToModel(filter);
    return this.teachingRankApiService.getTeachingRankList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.teachingRankMapperService
          .teachingRankListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().teachingRankList = value),
    );
  }

  public getTeachingRank$(id: number): Observable<ITeachingRankViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().teachingRankDetail) {
      return of(this.bookmarkService.getCurrentDataItem().teachingRankDetail);
    } else {
      return this.loadTeachingRank$(id);
    }
  }

  public loadTeachingRank$(id: number): Observable<ITeachingRankViewModel> {
    return this.teachingRankApiService.getTeachingRank$(id)
      .pipe(
        map(value => this.teachingRankMapperService.teachingRankGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().teachingRankDetail = value;
          this.bookmarkService.getCurrentDataItem().teachingRankDetailCopy = cloneDeep(value);
        })
      );
  }

  public createTeachingRank$(teachingRank: ITeachingRankViewModel): Observable<IdSimpleItem> {
    const body = this.teachingRankMapperService.teachingRankViewModelToPostModel(teachingRank);
    return this.teachingRankApiService.createTeachingRank$(body)
      .pipe(map(value => value.data));
  }

  public updateTeachingRank$(teachingRank: ITeachingRankViewModel): Observable<ITeachingRankViewModel> {
    const body = this.teachingRankMapperService.teachingRankViewModelToPutModel(teachingRank);
    return this.teachingRankApiService.updateTeachingRank$(body)
      .pipe(
        map(value => this.teachingRankMapperService.teachingRankGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().teachingRankDetail = value;
          this.bookmarkService.getCurrentDataItem().teachingRankDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteTeachingRank$(teachingRank: ITeachingRankViewModel): Observable<IdSimpleItem> {
    return this.teachingRankApiService.deleteTeachingRank$(teachingRank.id, teachingRank.guid)
      .pipe(map(resp => resp.data));
  }

  public getTeachingRankDetailsViewState$(): Observable<ITeachingRankDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().teachingRankDetails)) {
      this.bookmarkService.getCurrentViewState().teachingRankDetails = this.teachingRankMapperService
        .teachingRankInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().teachingRankDetails);
  }

  // endregion

  // region Teaching rank teachers

  public getViewStateTeachingRankTeachersListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().teachingRankTeachersListPaginator)) {
      this.bookmarkService.getCurrentViewState().teachingRankTeachersListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().teachingRankTeachersListPaginator);
  }

  public getTeachingRankTeachersList$(paginator: IPaginatorBase, academicTitle: ITeachingRankViewModel):
    Observable<IPaginator<IdNameSimpleItem>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().teachingRankTeachersList)) {
      return of(this.bookmarkService.getCurrentDataItem().teachingRankTeachersList);
    } else {
      return this.loadTeachingRankTeachersList$(paginator, academicTitle);
    }
  }

  public loadTeachingRankTeachersList$(paginator: IPaginatorBase, academicTitle: ITeachingRankViewModel):
    Observable<IPaginator<IdNameSimpleItem>> {
    const filter = this.teachingRankMapperService.teachingRankViewModelToTeachersFilterModel(academicTitle);
    return this.teachingRankApiService.getTeachingRankTeachersList$(paginator, filter)
      .pipe(
        map(resp => cloneDeep(resp.data)),
        tap(resp => this.bookmarkService.getCurrentDataItem().teachingRankTeachersList = resp)
      );
  }

  // endregion
}
