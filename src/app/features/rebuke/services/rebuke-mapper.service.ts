import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IRebukeListViewModel} from '../types/view-model/rebuke-list-view-model';
import {IRebukeViewModel} from '../types/view-model/rebuke-view-model';
import {IRebukeFilterViewModel} from '../types/view-model/rebuke-filter-view-model';
import {IRebukeGetModel} from '../types/model/rebuke-get-model';
import {IRebukePutModel} from '../types/model/rebuke-put-model';
import {IRebukePostModel} from '../types/model/rebuke-post-model';
import {IRebukeDetailsViewState} from '../types/view-model/rebuke-details-view-state';
import {IRebukeFilterModel} from '../types/model/rebuke-filter-model';
import {IRebukeListGetModel} from '../types/model/rebuke-list-get-model';

@Injectable({
  providedIn: 'root',
})
export class RebukeMapperService {
  public rebukeListGetModelToViewModel(source: IRebukeListGetModel): IRebukeListViewModel {
    let destination = {} as IRebukeListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        date: source.date,
        teacher: source.teacher,
        isDeleted: source.isDeleted,
        isActive: source.isActive,
        title: source.title,
        orderNumber: source.orderNumber
      };
    }

    return destination;
  }

  public rebukeGetModelToViewModel(source: IRebukeGetModel): IRebukeViewModel {
    let destination = {} as IRebukeViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        date: source.date,
        teacher: source.teacher,
        orderNumber: source.orderNumber,
        isActive: source.isActive,
        title: source.title,
        description: source.description,
        guid: source.guid,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public rebukeViewModelToPutModel(source: IRebukeViewModel): IRebukePutModel {
    let destination = {} as IRebukePutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        date: source.date,
        orderNumber: source.orderNumber,
        isActive: source.isActive,
        title: source.title,
        description: source.description,
        teacherId: source.teacher?.id,
        guid: source.guid
      };
    }

    return destination;
  }

  public rebukeViewModelToPostModel(source: IRebukeViewModel): IRebukePostModel {
    let destination = {} as IRebukePostModel;

    if (!isNil(source)) {
      destination = {
        description: source.description,
        teacherId: source.teacher?.id,
        date: source.date,
        orderNumber: source.orderNumber,
        isActive: source.isActive,
        title: source.title
      };
    }

    return destination;
  }

  public rebukeInitializeViewModel(): IRebukeViewModel {
    return {
      id: null,
      teacher: {
        id: null,
        name: ''
      },
      title: '',
      description: '',
      date: '',
      isActive: true,
      orderNumber: '',
      guid: null,
      isDeleted: false
    };
  }

  public rebukeInitializeFilterViewModel(): IRebukeFilterViewModel {
    return {
      dateLess: '',
      title: '',
      dateMore: '',
      orderNumber: '',
      teacherId: null,
      showInActive: false,
      showDeleted: false
    };
  }

  public rebukeInitializeDetailsViewState(): IRebukeDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public rebukeFilterViewModelToModel(source: IRebukeFilterViewModel): IRebukeFilterModel {
    let destination = {} as IRebukeFilterModel;

    if (!isNil(source)) {
      destination = {
        dateLess: source.dateLess || null,
        dateMore: source.dateMore || null,
        title: source.title,
        orderNumber: source.orderNumber,
        teacherId: source.teacherId,
        showInActive: source.showInActive,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }
}
