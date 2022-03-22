import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {IPaginator} from '../../../shared/types/paginator';
import {map, tap} from 'rxjs/operators';
import {CategoryApiService} from './category-api.service';
import {CategoryMapperService} from './category-mapper.service';
import {cloneDeep, isNil} from 'lodash';
import {ICategoryListViewModel} from '../types/view-model/category-list-view-model';
import {ICategoryViewModel} from '../types/view-model/category-view-model';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {ICategoryFilterViewModel} from '../types/view-model/category-filter-view-model';
import {ICategoryDetailsViewState} from '../types/view-model/category-details-view-state';
import {ICategoryAttestationViewModel} from '../types/view-model/category-attestation-view-model';

@Injectable({
  providedIn: 'root'
})
export class CategoryFacadeService {
  public refreshDetails$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private categoryMapperService: CategoryMapperService,
    private categoryApiService: CategoryApiService,
  ) {
  }

  //region Category

  public getViewStateCategoryListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().categoryListPaginator)) {
      this.bookmarkService.getCurrentViewState().categoryListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().categoryListPaginator);
  }

  public getViewStateCategoryFilter$(): Observable<ICategoryFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentViewState().categoryFilter)) {
      this.bookmarkService.getCurrentViewState().categoryFilter = this.categoryMapperService
        .categoryInitializeFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentViewState().categoryFilter);
  }

  public getCategoryList$(paginator: IPaginatorBase, filter: ICategoryFilterViewModel):
    Observable<IPaginator<ICategoryListViewModel>> {
    if (!!this.bookmarkService.getCurrentDataItem().categoryList) {
      return of(this.bookmarkService.getCurrentDataItem().categoryList);
    } else {
      return this.loadCategoryList$(paginator, filter);
    }
  }

  public loadCategoryList$(paginator: IPaginatorBase, filter: ICategoryFilterViewModel):
    Observable<IPaginator<ICategoryListViewModel>> {
    const filterModel = this.categoryMapperService.categoryFilterViewModelToModel(filter);
    return this.categoryApiService.getCategoryList$(paginator, filterModel).pipe(
      map(value => ({
        ...value.data,
        responseList: value.data.responseList.map(item => this.categoryMapperService.categoryListGetModelToViewModel(item)),
      })),
      tap(value => this.bookmarkService.getCurrentDataItem().categoryList = value),
    );
  }

  public getCategory$(id: number): Observable<ICategoryViewModel> {
    if (!!this.bookmarkService.getCurrentDataItem().categoryDetail) {
      return of(this.bookmarkService.getCurrentDataItem().categoryDetail);
    } else {
      return this.loadCategory$(id);
    }
  }

  public loadCategory$(id: number): Observable<ICategoryViewModel> {
    return this.categoryApiService.getCategory$(id)
      .pipe(
        map(value => this.categoryMapperService.categoryGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().categoryDetail = value;
          this.bookmarkService.getCurrentDataItem().categoryDetailCopy = cloneDeep(value);
        })
      );
  }

  public createCategory$(teachingRank: ICategoryViewModel): Observable<IdSimpleItem> {
    const body = this.categoryMapperService.categoryViewModelToPostModel(teachingRank);
    return this.categoryApiService.createCategory$(body).pipe(map(value => value.data));
  }

  public updateCategory$(teachingRank: ICategoryViewModel): Observable<ICategoryViewModel> {
    const body = this.categoryMapperService.categoryViewModelToPutModel(teachingRank);
    return this.categoryApiService.updateCategory$(body)
      .pipe(
        map(value => this.categoryMapperService.categoryGetModelToViewModel(value.data)),
        tap(value => {
          this.bookmarkService.getCurrentDataItem().categoryDetail = value;
          this.bookmarkService.getCurrentDataItem().categoryDetailCopy = cloneDeep(value);
        })
      );
  }

  public deleteCategory$(teachingRank: ICategoryViewModel): Observable<IdSimpleItem> {
    return this.categoryApiService.deleteCategory$(teachingRank.id, teachingRank.guid).pipe(map(resp => resp.data));
  }

  public getCategoryDetailsViewState$(): Observable<ICategoryDetailsViewState> {
    if (isNil(this.bookmarkService.getCurrentViewState().categoryDetails)) {
      this.bookmarkService.getCurrentViewState().categoryDetails = this.categoryMapperService
        .categoryInitializeDetailsViewState();
    }

    return of(this.bookmarkService.getCurrentViewState().categoryDetails);
  }

  // endregion

  // region Category attestations

  public getViewStateCategoryAttestationsListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().categoryAttestationsListPaginator)) {
      this.bookmarkService.getCurrentViewState().categoryAttestationsListPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().categoryAttestationsListPaginator);
  }

  public getCategoryAttestationsList$(paginator: IPaginatorBase, academicTitle: ICategoryViewModel):
    Observable<IPaginator<ICategoryAttestationViewModel>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().categoryAttestationsList)) {
      return of(this.bookmarkService.getCurrentDataItem().categoryAttestationsList);
    } else {
      return this.loadCategoryAttestationsList$(paginator, academicTitle);
    }
  }

  public loadCategoryAttestationsList$(paginator: IPaginatorBase, academicTitle: ICategoryViewModel):
    Observable<IPaginator<ICategoryAttestationViewModel>> {
    const filter = this.categoryMapperService.categoryViewModelToAttestationsFilterModel(academicTitle);
    return this.categoryApiService.getCategoryAttestationsList$(paginator, filter)
      .pipe(
        map(resp => cloneDeep(resp.data)),
        tap(resp => this.bookmarkService.getCurrentDataItem().categoryAttestationsList = resp)
      );
  }

  // endregion
}
