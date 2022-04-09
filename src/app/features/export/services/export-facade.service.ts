import {Injectable} from '@angular/core';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ExportApiService} from './export-api.service';
import {ExportMapperService} from './export-mapper.service';
import {Observable, of} from 'rxjs';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {map} from 'rxjs/operators';
import {IGenerateReportFilterViewModel} from '../types/view-model/generate-report-filter-view-model';
import {IGenerateReportViewModel} from '../types/view-model/generate-report-view-model';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IPaginator} from '../../../shared/types/paginator';
import {isNil} from 'lodash';

@Injectable({providedIn: 'root'})
export class ExportFacadeService {
  constructor(
    private bookmarkService: BookmarkService,
    private exportMapperService: ExportMapperService,
    private exportApiService: ExportApiService,
  ) {
  }

  //region Export

  generateReport$(filter: IGenerateReportFilterViewModel): Observable<IGenerateReportViewModel> {
    const filterModel = this.exportMapperService.generateFilterViewModelToModel(filter);
    return this.exportApiService.generateReport$(filterModel).pipe(map(resp =>
      this.exportMapperService.generateReportGetModelToViewModel(resp.data)));
  }

  getExportTypes$(): Observable<Array<IdNameSimpleItem>> {
    return this.exportApiService.getExportTypes$().pipe(map(resp => resp.data.responseList));
  }

  getExportCommissionListDropdown$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.exportApiService.getExportCommissionList$(paginator).pipe(map(resp => resp.data));
  }

  getExportCommissionDropdownItem$(id: number): Observable<IdNameSimpleItem> {
    return this.exportApiService.getExportCommissionById$(id).pipe(map(resp => resp.data));
  }

  getExportDepartmentListDropdown$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.exportApiService.getExportDepartmentList$(paginator).pipe(map(resp => resp.data));
  }

  getExportDepartmentDropdownItem$(id: number): Observable<IdNameSimpleItem> {
    return this.exportApiService.getExportDepartmentById$(id).pipe(map(resp => resp.data));
  }

  getExportTeacherListDropdown$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.exportApiService.getExportTeacherList$(paginator).pipe(map(resp => resp.data));
  }

  getExportTeacherDropdownItems$(ids: Array<number>): Observable<Array<IdNameSimpleItem>> {
    return this.exportApiService.getExportTeacherByIds$(ids).pipe(map(resp => resp.data));
  }

  getExportFilter$(): Observable<IGenerateReportFilterViewModel> {
    if (isNil(this.bookmarkService.getCurrentDataItem().exportFilter)) {
      this.bookmarkService.getCurrentDataItem().exportFilter = this.exportMapperService.initializeGenerateFilterViewModel();
    }

    return of(this.bookmarkService.getCurrentDataItem().exportFilter);
  }

  // endregion
}
