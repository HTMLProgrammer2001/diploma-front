import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {AttestationApiService} from './attestation-api.service';
import {AttestationMapperService} from './attestation-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {IAttestationListViewModel} from '../types/view-model/attestation-list-view-model';
import {IAttestationViewModel} from '../types/view-model/attestation-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IAttestationFilterViewModel} from '../types/view-model/attestation-filter-view-model';
import {IAttestationDetailsViewState} from '../types/view-model/attestation-details-view-state';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({
  providedIn: 'root'
})
export class AttestationFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private attestationMapperService: AttestationMapperService,
    private attestationApiService: AttestationApiService,
  ) {
  }

  //region Attestation

  public getViewStateAttestationListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().attestationListPaginator)) {
      this.bookmarkService.getCurrentViewState().attestationListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().attestationListPaginator);
  }

  public getViewStateAttestationFilter$(): Observable<IAttestationFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().attestationFilter)) {
      this.bookmarkService.getCurrentViewState().attestationFilter = this.attestationMapperService
        .attestationInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().attestationFilter);
  }

  public getAttestationList$(paginator: IPaginatorBase, filter: IAttestationFilterViewModel):
    Observable<IPaginator<IAttestationListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().attestationList) {
      return of(this.bookmarkService.getCurrentDataItem().attestationList);
    } else {
      return this.loadAttestationList$(paginator, filter);
    }
  }

  public loadAttestationList$(paginator: IPaginatorBase, filter: IAttestationFilterViewModel):
    Observable<IPaginator<IAttestationListViewModel>> {
    const filterModel = this.attestationMapperService.attestationFilterViewModelToModel(filter);
    return this.attestationApiService.getAttestationList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.attestationMapperService.attestationListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().attestationList = value),
    );
  }

  public getAttestation$(id: number): Observable<IAttestationViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().attestationDetail) {
      return of(this.bookmarkService.getCurrentDataItem().attestationDetail);
    } else {
      return this.loadAttestation$(id);
    }
  }

  public loadAttestation$(id: number): Observable<IAttestationViewModel> {
    return this.attestationApiService.getAttestation$(id)
      .pipe(
        map(value => this.attestationMapperService.attestationGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().attestationDetail = value;
          this.bookmarkService.getCurrentDataItem().attestationDetailCopy = cloneDeep(value);
        })
      );
  }

  public createAttestation$(teachingRank: IAttestationViewModel): Observable<IdSimpleItem> {
    const body = this.attestationMapperService.attestationViewModelToPostModel(teachingRank);
    return this.attestationApiService.createAttestation$(body).pipe(map(value => value.data));
  }

  public updateAttestation$(teachingRank: IAttestationViewModel): Observable<IAttestationViewModel> {
    const body = this.attestationMapperService.attestationViewModelToPutModel(teachingRank);
    return this.attestationApiService.updateAttestation$(body)
      .pipe(
        map(value => this.attestationMapperService.attestationGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().attestationDetail = value;
          this.bookmarkService.getCurrentDataItem().attestationDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteAttestation$(teachingRank: IAttestationViewModel): Observable<IdSimpleItem> {
    return this.attestationApiService.deleteAttestation$(teachingRank.id, teachingRank.guid).pipe(map(resp => resp.data));
  }

  public getAttestationDetailsViewState$(): Observable<IAttestationDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().attestationDetails)) {
      this.bookmarkService.getCurrentViewState().attestationDetails = this.attestationMapperService
        .attestationInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().attestationDetails);
  }

  // endregion


  // region Attestation dropdowns

  public getTeacherDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.attestationApiService.getTeacherDropdown$(paginator).pipe(map(resp => resp.data));
  }

  public getTeacherDropdownItem$(id: number): Observable<IdNameSimpleItem> {
    return this.attestationApiService.getTeacherDropdownItem$(id).pipe(map(resp => resp.data));
  }

  public getCategoryDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.attestationApiService.getCategoryDropdown$(paginator).pipe(map(resp => resp.data));
  }

  public getCategoryDropdownItem$(id: number): Observable<IdNameSimpleItem> {
    return this.attestationApiService.getCategoryDropdownItem$(id).pipe(map(resp => resp.data));
  }

  // endregion
}
