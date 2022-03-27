import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {RebukeApiService} from './rebuke-api.service';
import {RebukeMapperService} from './rebuke-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {IRebukeListViewModel} from '../types/view-model/rebuke-list-view-model';
import {IRebukeViewModel} from '../types/view-model/rebuke-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IRebukeFilterViewModel} from '../types/view-model/rebuke-filter-view-model';
import {IRebukeDetailsViewState} from '../types/view-model/rebuke-details-view-state';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({
  providedIn: 'root'
})
export class RebukeFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private rebukeMapperService: RebukeMapperService,
    private rebukeApiService: RebukeApiService,
  ) {
  }

  //region Rebuke

  public getViewStateRebukeListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().rebukeListPaginator)) {
      this.bookmarkService.getCurrentViewState().rebukeListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().rebukeListPaginator);
  }

  public getViewStateRebukeFilter$(): Observable<IRebukeFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().rebukeFilter)) {
      this.bookmarkService.getCurrentViewState().rebukeFilter = this.rebukeMapperService
        .rebukeInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().rebukeFilter);
  }

  public getRebukeList$(paginator: IPaginatorBase, filter: IRebukeFilterViewModel):
    Observable<IPaginator<IRebukeListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().rebukeList) {
      return of(this.bookmarkService.getCurrentDataItem().rebukeList);
    } else {
      return this.loadRebukeList$(paginator, filter);
    }
  }

  public loadRebukeList$(paginator: IPaginatorBase, filter: IRebukeFilterViewModel):
    Observable<IPaginator<IRebukeListViewModel>> {
    const filterModel = this.rebukeMapperService.rebukeFilterViewModelToModel(filter);
    return this.rebukeApiService.getRebukeList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.rebukeMapperService
          .rebukeListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().rebukeList = value),
    );
  }

  public getRebuke$(id: number): Observable<IRebukeViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().rebukeDetail) {
      return of(this.bookmarkService.getCurrentDataItem().rebukeDetail);
    } else {
      return this.loadRebuke$(id);
    }
  }

  public loadRebuke$(id: number): Observable<IRebukeViewModel> {
    return this.rebukeApiService.getRebuke$(id)
      .pipe(
        map(value => this.rebukeMapperService.rebukeGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().rebukeDetail = value;
          this.bookmarkService.getCurrentDataItem().rebukeDetailCopy = cloneDeep(value);
        })
      );
  }

  public createRebuke$(rebuke: IRebukeViewModel): Observable<IdSimpleItem> {
    const body = this.rebukeMapperService.rebukeViewModelToPostModel(rebuke);
    return this.rebukeApiService.createRebuke$(body).pipe(map(value => value.data));
  }

  public updateRebuke$(rebuke: IRebukeViewModel):
    Observable<IRebukeViewModel> {
    const body = this.rebukeMapperService.rebukeViewModelToPutModel(rebuke);
    return this.rebukeApiService.updateRebuke$(body)
      .pipe(
        map(value => this.rebukeMapperService.rebukeGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().rebukeDetail = value;
          this.bookmarkService.getCurrentDataItem().rebukeDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteRebuke$(rebuke: IRebukeViewModel): Observable<IdSimpleItem> {
    return this.rebukeApiService.deleteRebuke$(rebuke.id, rebuke.guid).pipe(map(resp => resp.data));
  }

  public getRebukeDetailsViewState$(): Observable<IRebukeDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().rebukeDetails)) {
      this.bookmarkService.getCurrentViewState().rebukeDetails = this.rebukeMapperService
        .rebukeInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().rebukeDetails);
  }

  // endregion

  // region Rebuke dropdowns

  public getTeacherDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.rebukeApiService.getTeacherDropdown$(paginator).pipe(map(resp => resp.data));
  }

  public getTeacherDropdownItem$(id: number): Observable<IdNameSimpleItem> {
    return this.rebukeApiService.getTeacherDropdownItem$(id).pipe(map(resp => resp.data));
  }

  // endregion
}
