import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {InternshipApiService} from './internship-api.service';
import {InternshipMapperService} from './internship-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {IInternshipListViewModel} from '../types/view-model/internship-list-view-model';
import {IInternshipViewModel} from '../types/view-model/internship-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IInternshipFilterViewModel} from '../types/view-model/internship-filter-view-model';
import {IInternshipDetailsViewState} from '../types/view-model/internship-details-view-state';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({
  providedIn: 'root'
})
export class InternshipFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private internshipMapperService: InternshipMapperService,
    private internshipApiService: InternshipApiService,
  ) {
  }

  //region Internship

  public getViewStateInternshipListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().internshipListPaginator)) {
      this.bookmarkService.getCurrentViewState().internshipListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().internshipListPaginator);
  }

  public getViewStateInternshipFilter$(): Observable<IInternshipFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().internshipFilter)) {
      this.bookmarkService.getCurrentViewState().internshipFilter = this.internshipMapperService
        .internshipInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().internshipFilter);
  }

  public getInternshipList$(paginator: IPaginatorBase, filter: IInternshipFilterViewModel):
    Observable<IPaginator<IInternshipListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().internshipList) {
      return of(this.bookmarkService.getCurrentDataItem().internshipList);
    } else {
      return this.loadInternshipList$(paginator, filter);
    }
  }

  public loadInternshipList$(paginator: IPaginatorBase, filter: IInternshipFilterViewModel):
    Observable<IPaginator<IInternshipListViewModel>> {
    const filterModel = this.internshipMapperService.internshipFilterViewModelToModel(filter);
    return this.internshipApiService.getInternshipList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.internshipMapperService
          .internshipListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().internshipList = value),
    );
  }

  public getInternship$(id: number): Observable<IInternshipViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().internshipDetail) {
      return of(this.bookmarkService.getCurrentDataItem().internshipDetail);
    } else {
      return this.loadInternship$(id);
    }
  }

  public loadInternship$(id: number): Observable<IInternshipViewModel> {
    return this.internshipApiService.getInternship$(id)
      .pipe(
        map(value => this.internshipMapperService.internshipGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().internshipDetail = value;
          this.bookmarkService.getCurrentDataItem().internshipDetailCopy = cloneDeep(value);
        })
      );
  }

  public createInternship$(internship: IInternshipViewModel): Observable<IdSimpleItem> {
    const body = this.internshipMapperService.internshipViewModelToPostModel(internship);
    return this.internshipApiService.createInternship$(body)
      .pipe(map(value => value.data));
  }

  public updateInternship$(internship: IInternshipViewModel):
    Observable<IInternshipViewModel> {
    const body = this.internshipMapperService.internshipViewModelToPutModel(internship);
    return this.internshipApiService.updateInternship$(body)
      .pipe(
        map(value => this.internshipMapperService.internshipGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().internshipDetail = value;
          this.bookmarkService.getCurrentDataItem().internshipDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteInternship$(internship: IInternshipViewModel): Observable<IdSimpleItem> {
    return this.internshipApiService.deleteInternship$(
      internship.id,
      internship.guid
    ).pipe(map(resp => resp.data));
  }

  public getInternshipDetailsViewState$(): Observable<IInternshipDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().internshipDetails)) {
      this.bookmarkService.getCurrentViewState().internshipDetails = this.internshipMapperService
        .internshipInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().internshipDetails);
  }

  // endregion

  // region Internship dropdowns

  public getTeacherDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.internshipApiService.getTeacherDropdown$(paginator).pipe(map(resp => resp.data));
  }

  public getTeacherDropdownItem$(id: number): Observable<IdNameSimpleItem> {
    return this.internshipApiService.getTeacherDropdownItem$(id).pipe(map(resp => resp.data));
  }

  // endregion
}
