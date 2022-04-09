import {Injectable} from '@angular/core';
import {IImportBodyModel} from '../types/model/import-body-model';
import {IImportBodyViewModel} from '../types/view-model/import-body-view-model';
import {isNil} from 'lodash';
import {IImportResultModel} from '../types/model/import-result-model';
import {IImportResultViewModel} from '../types/view-model/import-result-view-model';
import {IImportErrorModel} from '../types/model/import-error-model';
import {IImportErrorViewModel} from '../types/view-model/import-error-view-model';

@Injectable({providedIn: 'root'})
export class ImportMapperService {
  importBodyModelToViewModel(source: IImportBodyViewModel): IImportBodyModel {
    let destination = {} as IImportBodyModel;

    if (!isNil(source)) {
      destination = {
        from: source.from,
        to: source.to,
        type: Number(source.type),
        file: source.file,
        ignoreErrors: source.ignoreErrors
      };
    }

    return destination;
  }

  importResultModelToViewModel(source: IImportResultModel): IImportResultViewModel {
    let destination = {} as IImportResultViewModel;

    if (!isNil(source)) {
      destination = {
        result: source.result,
        errors: source.errors?.map(err => this.importErrorModelToViewModel(err)) || []
      };
    }

    return destination;
  }

  importErrorModelToViewModel(source: IImportErrorModel): IImportErrorViewModel {
    let destination = {} as IImportErrorViewModel;

    if (!isNil(source)) {
      destination = {
        row: source.row,
        message: source.message,
        property: source.property
      };
    }

    return destination;
  }

  initializeImportBodyViewModel(): IImportBodyViewModel {
    return {
      from: null,
      to: null,
      type: null,
      file: null,
      ignoreErrors: false
    };
  }
}
