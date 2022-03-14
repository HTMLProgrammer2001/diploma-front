import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {ICommissionListGetModel} from '../types/model/commission-list-get-model';
import {ICommissionListViewModel} from '../types/view-model/commission-list-view-model';
import {ICommissionViewModel} from '../types/view-model/commission-view-model';
import {ICommissionPutModel} from '../types/model/commission-put-model';
import {ICommissionGetModel} from '../types/model/commission-get-model';
import {ICommissionPostModel} from '../types/model/commission-post-model';
import {ICommissionFilterViewModel} from '../types/view-model/commission-filter-view-model';
import {ICommissionFilterModel} from '../types/model/commission-filter-model';
import {ICommissionTeachersFilterModel} from '../types/model/commission-teachers-filter-model';
import {ICommissionDetailsViewState} from '../types/view-model/commission-details-view-state';

@Injectable({
  providedIn: 'root',
})
export class CommissionMapperService {
  public commissionListGetModelToViewModel(source: ICommissionListGetModel): ICommissionListViewModel {
    let destination = {} as ICommissionListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public commissionGetModelToViewModel(source: ICommissionGetModel): ICommissionViewModel {
    let destination = {} as ICommissionViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        guid: source.guid,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public commissionViewModelToPutModel(source: ICommissionViewModel): ICommissionPutModel {
    let destination = {} as ICommissionPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        guid: source.guid
      };
    }

    return destination;
  }

  public commissionViewModelToPostModel(source: ICommissionViewModel): ICommissionPostModel {
    let destination = {} as ICommissionPostModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
      };
    }

    return destination;
  }

  public commissionInitializeViewModel(): ICommissionViewModel {
    return {
      id: null,
      name: '',
      guid: null,
      isDeleted: false
    };
  }

  public commissionInitializeFilterViewModel(): ICommissionFilterViewModel {
    return {
      name: '',
      showDeleted: false
    };
  }

  public commissionInitializeDetailsViewState(): ICommissionDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public commissionFilterViewModelToModel(source: ICommissionFilterViewModel): ICommissionFilterModel {
    let destination = {} as ICommissionFilterViewModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }

  public commissionViewModelToCommissionTeachersFilterModel(source: ICommissionViewModel): ICommissionTeachersFilterModel {
    let destination = {} as ICommissionTeachersFilterModel;

    if (!isNil(source)) {
      destination = {
        commissionId: source.id,
        showDeleted: source.isDeleted,
        showCascadeDeletedBy: source.isDeleted ? 'commission' : undefined
      };
    }

    return destination;
  }
}
