import {Injectable} from '@angular/core';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {ImportApiService} from './import-api.service';
import {ImportMapperService} from './import-mapper.service';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {Observable, of} from 'rxjs';
import {IPaginator} from '../../../shared/types/paginator';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {map, tap} from 'rxjs/operators';
import {IGenerateImportTemplateModel} from '../types/model/generate-import-template-model';
import {IImportBodyViewModel} from '../types/view-model/import-body-view-model';
import {IImportResultViewModel} from '../types/view-model/import-result-view-model';
import {isNil} from 'lodash';
import {IImportErrorViewModel} from '../types/view-model/import-error-view-model';

@Injectable({providedIn: 'root'})
export class ImportFacadeService {
  constructor(
    private bookmarkService: BookmarkService,
    private importMapperService: ImportMapperService,
    private importApiService: ImportApiService,
  ) {
  }

  //region Import

  getImportErrors$(): Observable<Array<IImportErrorViewModel>> {
    if (isNil(this.bookmarkService.getCurrentDataItem().importErrors)) {
      this.bookmarkService.getCurrentDataItem().importErrors = [];
    }

    return of(this.bookmarkService.getCurrentDataItem().importErrors);
  }

  getImportBody$(): Observable<IImportBodyViewModel> {
    if (isNil(this.bookmarkService.getCurrentDataItem().importBody)) {
      this.bookmarkService.getCurrentDataItem().importBody = this.importMapperService.initializeImportBodyViewModel();
    }

    return of(this.bookmarkService.getCurrentDataItem().importBody);
  }

  getImportTypeDropdownList$(paginator: IPaginatorBase): Observable<IPaginator<IdNameSimpleItem>> {
    return this.importApiService.getImportTypeDropdownList$(paginator).pipe(map(resp => resp.data));
  }

  getImportTypeDropdownItem$(id: number): Observable<IdNameSimpleItem> {
    return this.importApiService.getImportTypeDropdownItem$(id).pipe(map(resp => resp.data));
  }

  importTemplateGenerate$(type: number): Observable<IGenerateImportTemplateModel> {
    return this.importApiService.generateImportTemplate$(Number(type)).pipe(map(resp => resp.data));
  }

  importData$(viewModel: IImportBodyViewModel): Observable<IImportResultViewModel> {
    const body = this.importMapperService.importBodyModelToViewModel(viewModel);
    return this.importApiService.importData$(body)
      .pipe(
        map(resp => this.importMapperService.importResultModelToViewModel(resp.data)),
        tap(resp => this.bookmarkService.getCurrentDataItem().importErrors = resp.errors || [])
      );
  }

  // endregion
}
