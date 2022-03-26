import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {PublicationApiService} from './publication-api.service';
import {PublicationMapperService} from './publication-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {IPublicationListViewModel} from '../types/view-model/publication-list-view-model';
import {IPublicationViewModel} from '../types/view-model/publication-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IPublicationFilterViewModel} from '../types/view-model/publication-filter-view-model';
import {IPublicationDetailsViewState} from '../types/view-model/publication-details-view-state';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({
  providedIn: 'root'
})
export class PublicationFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private publicationMapperService: PublicationMapperService,
    private publicationApiService: PublicationApiService,
  ) {
  }

  //region Publication

  public getViewStatePublicationListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().publicationListPaginator)) {
      this.bookmarkService.getCurrentViewState().publicationListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().publicationListPaginator);
  }

  public getViewStatePublicationFilter$(): Observable<IPublicationFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().publicationFilter)) {
      this.bookmarkService.getCurrentViewState().publicationFilter = this.publicationMapperService
        .publicationInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().publicationFilter);
  }

  public getPublicationList$(paginator: IPaginatorBase, filter: IPublicationFilterViewModel):
    Observable<IPaginator<IPublicationListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().publicationList) {
      return of(this.bookmarkService.getCurrentDataItem().publicationList);
    } else {
      return this.loadPublicationList$(paginator, filter);
    }
  }

  public loadPublicationList$(paginator: IPaginatorBase, filter: IPublicationFilterViewModel):
    Observable<IPaginator<IPublicationListViewModel>> {
    const filterModel = this.publicationMapperService.publicationFilterViewModelToModel(filter);
    return this.publicationApiService.getPublicationList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.publicationMapperService.publicationListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().publicationList = value),
    );
  }

  public getPublication$(id: number): Observable<IPublicationViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().publicationDetail) {
      return of(this.bookmarkService.getCurrentDataItem().publicationDetail);
    } else {
      return this.loadPublication$(id);
    }
  }

  public loadPublication$(id: number): Observable<IPublicationViewModel> {
    return this.publicationApiService.getPublication$(id)
      .pipe(
        map(value => this.publicationMapperService.publicationGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().publicationDetail = value;
          this.bookmarkService.getCurrentDataItem().publicationDetailCopy = cloneDeep(value);
        })
      );
  }

  public createPublication$(publication: IPublicationViewModel): Observable<IdSimpleItem> {
    const body = this.publicationMapperService.publicationViewModelToPostModel(publication);
    return this.publicationApiService.createPublication$(body).pipe(map(value => value.data));
  }

  public updatePublication$(publication: IPublicationViewModel): Observable<IPublicationViewModel> {
    const body = this.publicationMapperService.publicationViewModelToPutModel(publication);
    return this.publicationApiService.updatePublication$(body)
      .pipe(
        map(value => this.publicationMapperService.publicationGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().publicationDetail = value;
          this.bookmarkService.getCurrentDataItem().publicationDetailCopy = cloneDeep(value);
        })
      );
  }

  public deletePublication$(publication: IPublicationViewModel): Observable<IdSimpleItem> {
    return this.publicationApiService.deletePublication$(publication.id, publication.guid).pipe(map(resp => resp.data));
  }

  public getPublicationDetailsViewState$(): Observable<IPublicationDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().publicationDetails)) {
      this.bookmarkService.getCurrentViewState().publicationDetails = this.publicationMapperService
        .publicationInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().publicationDetails);
  }

  // endregion


  // region Publication dropdowns

  public getTeacherDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.publicationApiService.getTeacherDropdown$(paginator).pipe(map(resp => resp.data));
  }

  public getTeacherDropdownItems$(ids: Array<number>): Observable<Array<IdNameSimpleItem>> {
    return this.publicationApiService.getTeacherDropdownItems$(ids).pipe(map(resp => resp.data));
  }

  // endregion
}
