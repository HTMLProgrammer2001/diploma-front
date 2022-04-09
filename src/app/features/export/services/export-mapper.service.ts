import {Injectable} from '@angular/core';
import {IGenerateReportFilterViewModel} from '../types/view-model/generate-report-filter-view-model';
import {IGenerateReportFilterModel} from '../types/model/generate-report-filter-model';
import {isNil} from 'lodash';
import {IGenerateReportGetModel} from '../types/model/generate-report-get-model';
import {IGenerateReportViewModel} from '../types/view-model/generate-report-view-model';
import {ExportFilterTypeEnum} from '../views/view-export/view-export.component';

@Injectable({providedIn: 'root'})
export class ExportMapperService {
  generateFilterViewModelToModel(source: IGenerateReportFilterViewModel): IGenerateReportFilterModel {
    let destination = {} as IGenerateReportFilterModel;

    if (!isNil(source)) {
      destination = {
        from: source.from || undefined,
        to: source.to || undefined,
        commissionId: source.commissionId,
        select: source.select.map(el => Number(el)),
        departmentId: source.departmentId,
        teacherIds: source.teacherIds?.length ? source.teacherIds : undefined
      };
    }

    return destination;
  }

  initializeGenerateFilterViewModel(): IGenerateReportFilterViewModel {
    return {
      from: '',
      to: '',
      select: [],
      teacherIds: [],
      departmentId: null,
      commissionId: null,
      type: ExportFilterTypeEnum.ALL
    };
  }

  generateReportGetModelToViewModel(source: IGenerateReportGetModel): IGenerateReportViewModel {
    let destination = {} as IGenerateReportViewModel;

    if (!isNil(source)) {
      destination = {
        url: source.url
      };
    }

    return destination;
  }
}
