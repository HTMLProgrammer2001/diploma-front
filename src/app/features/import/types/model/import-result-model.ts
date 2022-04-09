import {IImportErrorModel} from './import-error-model';

export interface IImportResultModel {
  errors: Array<IImportErrorModel>;
  result: boolean;
}
