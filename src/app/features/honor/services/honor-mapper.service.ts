import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IHonorListViewModel} from '../types/view-model/honor-list-view-model';
import {IHonorViewModel} from '../types/view-model/honor-view-model';
import {IHonorFilterViewModel} from '../types/view-model/honor-filter-view-model';
import {IHonorGetModel} from '../types/model/honor-get-model';
import {IHonorPutModel} from '../types/model/honor-put-model';
import {IHonorPostModel} from '../types/model/honor-post-model';
import {IHonorDetailsViewState} from '../types/view-model/honor-details-view-state';
import {IHonorFilterModel} from '../types/model/honor-filter-model';
import {IHonorListGetModel} from '../types/model/honor-list-get-model';

@Injectable({
  providedIn: 'root',
})
export class HonorMapperService {
  public honorListGetModelToViewModel(source: IHonorListGetModel): IHonorListViewModel {
    let destination = {} as IHonorListViewModel;

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

  public honorGetModelToViewModel(source: IHonorGetModel): IHonorViewModel {
    let destination = {} as IHonorViewModel;

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

  public honorViewModelToPutModel(source: IHonorViewModel): IHonorPutModel {
    let destination = {} as IHonorPutModel;

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

  public honorViewModelToPostModel(source: IHonorViewModel): IHonorPostModel {
    let destination = {} as IHonorPostModel;

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

  public honorInitializeViewModel(): IHonorViewModel {
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

  public honorInitializeFilterViewModel(): IHonorFilterViewModel {
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

  public honorInitializeDetailsViewState(): IHonorDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public honorFilterViewModelToModel(source: IHonorFilterViewModel): IHonorFilterModel {
    let destination = {} as IHonorFilterModel;

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
