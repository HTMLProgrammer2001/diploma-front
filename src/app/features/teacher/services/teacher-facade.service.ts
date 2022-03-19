import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {TeacherApiService} from './teacher-api.service';
import {TeacherMapperService} from './teacher-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {ITeacherListViewModel} from '../types/view-model/teacher-list-view-model';
import {ITeacherViewModel} from '../types/view-model/teacher-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {ITeacherFilterViewModel} from '../types/view-model/teacher-filter-view-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {ITeacherDetailsViewState} from '../types/view-model/teacher-details-view-state';
import {IAcademicDegreeViewModel} from '../../academic-degree/types/view-model/academic-degree-view-model';
import {ITeacherAttestationListViewModel} from '../types/view-model/teacher-attestation-list-view-model';
import {ITeacherInternshipListViewModel} from '../types/view-model/teacher-internship-list-view-model';
import {ITeacherPublicationListViewModel} from '../types/view-model/teacher-publication-list-view-model';
import {ITeacherHonorListViewModel} from '../types/view-model/teacher-honor-list-view-model';
import {ITeacherRebukeListViewModel} from '../types/view-model/teacher-rebuke-list-view-model';
import {ITeacherEducationListViewModel} from '../types/view-model/teacher-education-list-view-model';
import {ITeacherInternshipListResponseViewModel} from '../types/view-model/teacher-internship-list-response-view-model';
import {ITeacherAttestationListResponseViewModel} from '../types/view-model/teacher-attestation-list-response-view-model';

@Injectable({
  providedIn: 'root'
})
export class TeacherFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private teacherMapperService: TeacherMapperService,
    private teacherApiService: TeacherApiService,
  ) {
  }

  //region Teacher

  public getViewStateTeacherListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().teacherListPaginator)) {
      this.bookmarkService.getCurrentViewState().teacherListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().teacherListPaginator);
  }

  public getViewStateTeacherFilter$(): Observable<ITeacherFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().teacherFilter)) {
      this.bookmarkService.getCurrentViewState().teacherFilter = this.teacherMapperService
        .teacherInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().teacherFilter);
  }

  public getTeacherList$(paginator: IPaginatorBase, filter: ITeacherFilterViewModel):
    Observable<IPaginator<ITeacherListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().teacherList) {
      return of(this.bookmarkService.getCurrentDataItem().teacherList);
    } else {
      return this.loadTeacherList$(paginator, filter);
    }
  }

  public loadTeacherList$(paginator: IPaginatorBase, filter: ITeacherFilterViewModel):
    Observable<IPaginator<ITeacherListViewModel>> {
    const filterModel = this.teacherMapperService.teacherFilterViewModelToModel(filter);
    return this.teacherApiService.getTeacherList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.teacherMapperService
          .teacherListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().teacherList = value),
    );
  }

  public getTeacher$(id: number): Observable<ITeacherViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().teacherDetail) {
      return of(this.bookmarkService.getCurrentDataItem().teacherDetail);
    } else {
      return this.loadTeacher$(id);
    }
  }

  public loadTeacher$(id: number): Observable<ITeacherViewModel> {
    return this.teacherApiService.getTeacher$(id)
      .pipe(
        map(value => this.teacherMapperService.teacherGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().teacherDetail = value;
          this.bookmarkService.getCurrentDataItem().teacherDetailCopy = cloneDeep(value);
        })
      );
  }

  public createTeacher$(teachingRank: ITeacherViewModel): Observable<IdSimpleItem> {
    const body = this.teacherMapperService.teacherViewModelToPostModel(teachingRank);
    return this.teacherApiService.createTeacher$(body)
      .pipe(map(value => value.data));
  }

  public updateTeacher$(teachingRank: ITeacherViewModel): Observable<ITeacherViewModel> {
    const body = this.teacherMapperService.teacherViewModelToPutModel(teachingRank);
    return this.teacherApiService.updateTeacher$(body)
      .pipe(
        map(value => this.teacherMapperService.teacherGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().teacherDetail = value;
          this.bookmarkService.getCurrentDataItem().teacherDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteTeacher$(teachingRank: ITeacherViewModel): Observable<IdSimpleItem> {
    return this.teacherApiService.deleteTeacher$(teachingRank.id, teachingRank.guid)
      .pipe(map(resp => resp.data));
  }

  public getTeacherDetailsViewState$(): Observable<ITeacherDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().teacherDetails)) {
      this.bookmarkService.getCurrentViewState().teacherDetails = this.teacherMapperService
        .teacherInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().teacherDetails);
  }

  // endregion

  // region Dropdowns

  public getCommissionDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.teacherApiService.getCommissionDropdownList$(paginator).pipe(map(resp => resp.data));
  }

  public getDepartmentDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.teacherApiService.getDepartmentDropdownList$(paginator).pipe(map(resp => resp.data));
  }

  public getTeachingRankDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.teacherApiService.getTeachingRankDropdownList$(paginator).pipe(map(resp => resp.data));
  }

  public getAcademicDegreeDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.teacherApiService.getAcademicDegreeDropdownList$(paginator).pipe(map(resp => resp.data));
  }

  public getAcademicTitleDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.teacherApiService.getAcademicTitleDropdownList$(paginator).pipe(map(resp => resp.data));
  }

  // endregion

  // region Teacher attestations

  public getViewStateTeacherAttestationListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().teacherAttestationListPaginator)) {
      this.bookmarkService.getCurrentViewState().teacherAttestationListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().teacherAttestationListPaginator);
  }

  public getTeacherAttestationList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<ITeacherAttestationListResponseViewModel> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().teacherAttestationList)) {
      return of(this.bookmarkService.getCurrentDataItem().teacherAttestationList);
    } else {
      return this.loadTeacherAttestationList$(paginator, teacher);
    }
  }

  public loadTeacherAttestationList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<ITeacherAttestationListResponseViewModel> {
    const filter = this.teacherMapperService.teacherViewModelToCommonTeacherDataFilterModel(teacher);
    return this.teacherApiService.getTeacherAttestationList(paginator, filter)
      .pipe(
        map(resp => this.teacherMapperService.teacherAttestationListResponseModelToViewModel(resp.data)),
        tap(resp => this.bookmarkService.getCurrentDataItem().teacherAttestationList = resp)
      );
  }

  // endregion

  // region Teacher internships

  public getViewStateTeacherInternshipListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().teacherInternshipListPaginator)) {
      this.bookmarkService.getCurrentViewState().teacherInternshipListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().teacherInternshipListPaginator);
  }

  public getTeacherInternshipList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<ITeacherInternshipListResponseViewModel> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().teacherInternshipList)) {
      return of(this.bookmarkService.getCurrentDataItem().teacherInternshipList);
    } else {
      return this.loadTeacherInternshipList$(paginator, teacher);
    }
  }

  public loadTeacherInternshipList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<ITeacherInternshipListResponseViewModel> {
    const filter = this.teacherMapperService.teacherViewModelToCommonTeacherDataFilterModel(teacher);
    return this.teacherApiService.getTeacherInternshipList(paginator, filter)
      .pipe(
        map(resp => this.teacherMapperService.teacherInternshipResponseToViewModel(resp.data)),
        tap(resp => this.bookmarkService.getCurrentDataItem().teacherInternshipList = resp)
      );
  }

  // endregion

  // region Teacher publications

  public getViewStateTeacherPublicationListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().teacherPublicationListPaginator)) {
      this.bookmarkService.getCurrentViewState().teacherPublicationListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().teacherPublicationListPaginator);
  }

  public getTeacherPublicationList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<IPaginator<ITeacherPublicationListViewModel>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().teacherPublicationList)) {
      return of(this.bookmarkService.getCurrentDataItem().teacherPublicationList);
    } else {
      return this.loadTeacherPublicationList$(paginator, teacher);
    }
  }

  public loadTeacherPublicationList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<IPaginator<ITeacherPublicationListViewModel>> {
    const filter = this.teacherMapperService.teacherViewModelToCommonTeacherDataFilterModel(teacher);
    return this.teacherApiService.getTeacherPublicationList(paginator, filter)
      .pipe(
        map(resp => ({
          ...resp.data,
          responseList: resp.data.responseList.map(el => this.teacherMapperService.teacherPublicationGetModelToViewModel(el))
        })),
        tap(resp => this.bookmarkService.getCurrentDataItem().teacherPublicationList = resp)
      );
  }

  // endregion

  // region Teacher honors

  public getViewStateTeacherHonorListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().teacherHonorListPaginator)) {
      this.bookmarkService.getCurrentViewState().teacherHonorListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().teacherHonorListPaginator);
  }

  public getTeacherHonorList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<IPaginator<ITeacherHonorListViewModel>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().teacherHonorList)) {
      return of(this.bookmarkService.getCurrentDataItem().teacherHonorList);
    } else {
      return this.loadTeacherHonorList$(paginator, teacher);
    }
  }

  public loadTeacherHonorList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<IPaginator<ITeacherHonorListViewModel>> {
    const filter = this.teacherMapperService.teacherViewModelToCommonTeacherDataFilterModel(teacher);
    return this.teacherApiService.getTeacherHonorList(paginator, filter)
      .pipe(
        map(resp => ({
          ...resp.data,
          responseList: resp.data.responseList.map(el => this.teacherMapperService.teacherHonorGetModelToViewModel(el))
        })),
        tap(resp => this.bookmarkService.getCurrentDataItem().teacherHonorList = resp)
      );
  }

  // endregion

  // region Teacher rebukes

  public getViewStateTeacherRebukeListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().teacherRebukeListPaginator)) {
      this.bookmarkService.getCurrentViewState().teacherRebukeListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().teacherRebukeListPaginator);
  }

  public getTeacherRebukeList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<IPaginator<ITeacherRebukeListViewModel>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().teacherRebukeList)) {
      return of(this.bookmarkService.getCurrentDataItem().teacherRebukeList);
    } else {
      return this.loadTeacherRebukeList$(paginator, teacher);
    }
  }

  public loadTeacherRebukeList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<IPaginator<ITeacherRebukeListViewModel>> {
    const filter = this.teacherMapperService.teacherViewModelToCommonTeacherDataFilterModel(teacher);
    return this.teacherApiService.getTeacherRebukeList(paginator, filter)
      .pipe(
        map(resp => ({
          ...resp.data,
          responseList: resp.data.responseList.map(el => this.teacherMapperService.teacherRebukeGetModelToViewModel(el))
        })),
        tap(resp => this.bookmarkService.getCurrentDataItem().teacherRebukeList = resp)
      );
  }

  // endregion

  // region Teacher educations

  public getViewStateTeacherEducationListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().teacherEducationListPaginator)) {
      this.bookmarkService.getCurrentViewState().teacherEducationListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().teacherEducationListPaginator);
  }

  public getTeacherEducationList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<IPaginator<ITeacherEducationListViewModel>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().teacherEducationList)) {
      return of(this.bookmarkService.getCurrentDataItem().teacherEducationList);
    } else {
      return this.loadTeacherEducationList$(paginator, teacher);
    }
  }

  public loadTeacherEducationList$(paginator: IPaginatorBase, teacher: ITeacherViewModel):
    Observable<IPaginator<ITeacherEducationListViewModel>> {
    const filter = this.teacherMapperService.teacherViewModelToCommonTeacherDataFilterModel(teacher);
    return this.teacherApiService.getTeacherEducationList(paginator, filter)
      .pipe(
        map(resp => ({
          ...resp.data,
          responseList: resp.data.responseList.map(el => this.teacherMapperService.teacherEducationGetModelToViewModel(el))
        })),
        tap(resp => this.bookmarkService.getCurrentDataItem().teacherEducationList = resp)
      );
  }

  // endregion
}
