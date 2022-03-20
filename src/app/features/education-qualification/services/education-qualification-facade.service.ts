import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {EducationQualificationApiService} from './education-qualification-api.service';
import {EducationQualificationMapperService} from './education-qualification-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {IEducationQualificationListViewModel} from '../types/view-model/education-qualification-list-view-model';
import {IEducationQualificationViewModel} from '../types/view-model/education-qualification-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IEducationQualificationFilterViewModel} from '../types/view-model/education-qualification-filter-view-model';
import {IEducationQualificationDetailsViewState} from '../types/view-model/education-qualification-details-view-state';
import {IEducationQualificationEducationViewModel} from '../types/view-model/education-qualification-education-view-model';

@Injectable({
  providedIn: 'root'
})
export class EducationQualificationFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private educationQualificationMapperService: EducationQualificationMapperService,
    private educationQualificationApiService: EducationQualificationApiService,
  ) {
  }

  //region Education qualification

  public getViewStateEducationQualificationListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().educationQualificationListPaginator)) {
      this.bookmarkService.getCurrentViewState().educationQualificationListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().educationQualificationListPaginator);
  }

  public getViewStateEducationQualificationFilter$(): Observable<IEducationQualificationFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().educationQualificationFilter)) {
      this.bookmarkService.getCurrentViewState().educationQualificationFilter = this.educationQualificationMapperService
        .educationQualificationInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().educationQualificationFilter);
  }

  public getEducationQualificationList$(paginator: IPaginatorBase, filter: IEducationQualificationFilterViewModel):
    Observable<IPaginator<IEducationQualificationListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().educationQualificationList) {
      return of(this.bookmarkService.getCurrentDataItem().educationQualificationList);
    } else {
      return this.loadEducationQualificationList$(paginator, filter);
    }
  }

  public loadEducationQualificationList$(paginator: IPaginatorBase, filter: IEducationQualificationFilterViewModel):
    Observable<IPaginator<IEducationQualificationListViewModel>> {
    const filterModel = this.educationQualificationMapperService.educationQualificationFilterViewModelToModel(filter);
    return this.educationQualificationApiService.getEducationQualificationList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.educationQualificationMapperService
          .educationQualificationListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().educationQualificationList = value),
    );
  }

  public getEducationQualification$(id: number): Observable<IEducationQualificationViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().educationQualificationDetail) {
      return of(this.bookmarkService.getCurrentDataItem().educationQualificationDetail);
    } else {
      return this.loadEducationQualification$(id);
    }
  }

  public loadEducationQualification$(id: number): Observable<IEducationQualificationViewModel> {
    return this.educationQualificationApiService.getEducationQualification$(id)
      .pipe(
        map(value => this.educationQualificationMapperService.educationQualificationGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().educationQualificationDetail = value;
          this.bookmarkService.getCurrentDataItem().educationQualificationDetailCopy = cloneDeep(value);
        })
      );
  }

  public createEducationQualification$(educationQualification: IEducationQualificationViewModel): Observable<IdSimpleItem> {
    const body = this.educationQualificationMapperService.educationQualificationViewModelToPostModel(educationQualification);
    return this.educationQualificationApiService.createEducationQualification$(body)
      .pipe(map(value => value.data));
  }

  public updateEducationQualification$(educationQualification: IEducationQualificationViewModel):
    Observable<IEducationQualificationViewModel> {
    const body = this.educationQualificationMapperService.educationQualificationViewModelToPutModel(educationQualification);
    return this.educationQualificationApiService.updateEducationQualification$(body)
      .pipe(
        map(value => this.educationQualificationMapperService.educationQualificationGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().educationQualificationDetail = value;
          this.bookmarkService.getCurrentDataItem().educationQualificationDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteEducationQualification$(educationQualification: IEducationQualificationViewModel): Observable<IdSimpleItem> {
    return this.educationQualificationApiService.deleteEducationQualification$(
      educationQualification.id,
      educationQualification.guid
    ).pipe(map(resp => resp.data));
  }

  public getEducationQualificationDetailsViewState$(): Observable<IEducationQualificationDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().educationQualificationDetails)) {
      this.bookmarkService.getCurrentViewState().educationQualificationDetails = this.educationQualificationMapperService
        .educationQualificationInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().educationQualificationDetails);
  }

  // endregion

  // region Education qualification educations

  public getViewStateEducationQualificationEducationsListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().educationQualificationEducationsListPaginator)) {
      this.bookmarkService.getCurrentViewState().educationQualificationEducationsListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().educationQualificationEducationsListPaginator);
  }

  public getEducationQualificationEducationsList$(paginator: IPaginatorBase, academicTitle: IEducationQualificationViewModel):
    Observable<IPaginator<IEducationQualificationEducationViewModel>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().educationQualificationEducationsList)) {
      return of(this.bookmarkService.getCurrentDataItem().educationQualificationEducationsList);
    } else {
      return this.loadEducationQualificationEducationsList$(paginator, academicTitle);
    }
  }

  public loadEducationQualificationEducationsList$(paginator: IPaginatorBase, academicTitle: IEducationQualificationViewModel):
    Observable<IPaginator<IEducationQualificationEducationViewModel>> {
    const filter = this.educationQualificationMapperService.educationQualificationViewModelToTeachersFilterModel(academicTitle);
    return this.educationQualificationApiService.getEducationQualificationEducationsList$(paginator, filter)
      .pipe(
        map(resp => ({
          ...resp.data,
          responseList: resp.data.responseList.map(el => this.educationQualificationMapperService
            .educationQualificationEducationGetModelToViewModel(el))
        })),
        tap(resp => this.bookmarkService.getCurrentDataItem().educationQualificationEducationsList = resp)
      );
  }

  // endregion
}
