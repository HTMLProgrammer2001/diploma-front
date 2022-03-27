import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {HonorApiService} from './honor-api.service';
import {HonorMapperService} from './honor-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {IHonorListViewModel} from '../types/view-model/honor-list-view-model';
import {IHonorViewModel} from '../types/view-model/honor-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IHonorFilterViewModel} from '../types/view-model/honor-filter-view-model';
import {IHonorDetailsViewState} from '../types/view-model/honor-details-view-state';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({
  providedIn: 'root'
})
export class HonorFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private honorMapperService: HonorMapperService,
    private honorApiService: HonorApiService,
  ) {
  }

  //region Honor

  public getViewStateHonorListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().honorListPaginator)) {
      this.bookmarkService.getCurrentViewState().honorListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().honorListPaginator);
  }

  public getViewStateHonorFilter$(): Observable<IHonorFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().honorFilter)) {
      this.bookmarkService.getCurrentViewState().honorFilter = this.honorMapperService
        .honorInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().honorFilter);
  }

  public getHonorList$(paginator: IPaginatorBase, filter: IHonorFilterViewModel):
    Observable<IPaginator<IHonorListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().honorList) {
      return of(this.bookmarkService.getCurrentDataItem().honorList);
    } else {
      return this.loadHonorList$(paginator, filter);
    }
  }

  public loadHonorList$(paginator: IPaginatorBase, filter: IHonorFilterViewModel):
    Observable<IPaginator<IHonorListViewModel>> {
    const filterModel = this.honorMapperService.honorFilterViewModelToModel(filter);
    return this.honorApiService.getHonorList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.honorMapperService
          .honorListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().honorList = value),
    );
  }

  public getHonor$(id: number): Observable<IHonorViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().honorDetail) {
      return of(this.bookmarkService.getCurrentDataItem().honorDetail);
    } else {
      return this.loadHonor$(id);
    }
  }

  public loadHonor$(id: number): Observable<IHonorViewModel> {
    return this.honorApiService.getHonor$(id)
      .pipe(
        map(value => this.honorMapperService.honorGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().honorDetail = value;
          this.bookmarkService.getCurrentDataItem().honorDetailCopy = cloneDeep(value);
        })
      );
  }

  public createHonor$(honor: IHonorViewModel): Observable<IdSimpleItem> {
    const body = this.honorMapperService.honorViewModelToPostModel(honor);
    return this.honorApiService.createHonor$(body)
      .pipe(map(value => value.data));
  }

  public updateHonor$(honor: IHonorViewModel):
    Observable<IHonorViewModel> {
    const body = this.honorMapperService.honorViewModelToPutModel(honor);
    return this.honorApiService.updateHonor$(body)
      .pipe(
        map(value => this.honorMapperService.honorGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().honorDetail = value;
          this.bookmarkService.getCurrentDataItem().honorDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteHonor$(honor: IHonorViewModel): Observable<IdSimpleItem> {
    return this.honorApiService.deleteHonor$(
      honor.id,
      honor.guid
    ).pipe(map(resp => resp.data));
  }

  public getHonorDetailsViewState$(): Observable<IHonorDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().honorDetails)) {
      this.bookmarkService.getCurrentViewState().honorDetails = this.honorMapperService
        .honorInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().honorDetails);
  }

  // endregion

  // region Honor dropdowns

  public getTeacherDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.honorApiService.getTeacherDropdown$(paginator).pipe(map(resp => resp.data));
  }

  public getTeacherDropdownItem$(id: number): Observable<IdNameSimpleItem> {
    return this.honorApiService.getTeacherDropdownItem$(id).pipe(map(resp => resp.data));
  }

  // endregion
}
