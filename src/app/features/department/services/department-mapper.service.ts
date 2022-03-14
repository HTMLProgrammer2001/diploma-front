import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IDepartmentListGetModel} from '../types/model/department-list-get-model';
import {IDepartmentListViewModel} from '../types/view-model/department-list-view-model';
import {IDepartmentViewModel} from '../types/view-model/department-view-model';
import {IDepartmentPutModel} from '../types/model/department-put-model';
import {IDepartmentGetModel} from '../types/model/department-get-model';
import {IDepartmentPostModel} from '../types/model/department-post-model';
import {IDepartmentFilterViewModel} from '../types/view-model/department-filter-view-model';
import {IDepartmentFilterModel} from '../types/model/department-filter-model';
import {IDepartmentTeachersFilterModel} from '../types/model/department-teachers-filter-model';
import {IDepartmentDetailsViewState} from '../types/view-model/department-details-view-state';

@Injectable({
  providedIn: 'root',
})
export class DepartmentMapperService {
  public departmentListGetModelToViewModel(source: IDepartmentListGetModel): IDepartmentListViewModel {
    let destination = {} as IDepartmentListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public departmentGetModelToViewModel(source: IDepartmentGetModel): IDepartmentViewModel {
    let destination = {} as IDepartmentViewModel;

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

  public departmentViewModelToPutModel(source: IDepartmentViewModel): IDepartmentPutModel {
    let destination = {} as IDepartmentPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        guid: source.guid
      };
    }

    return destination;
  }

  public departmentViewModelToPostModel(source: IDepartmentViewModel): IDepartmentPostModel {
    let destination = {} as IDepartmentPostModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
      };
    }

    return destination;
  }

  public departmentInitializeViewModel(): IDepartmentViewModel {
    return {
      id: null,
      name: '',
      guid: null,
      isDeleted: false
    };
  }

  public departmentInitializeFilterViewModel(): IDepartmentFilterViewModel {
    return {
      name: '',
      showDeleted: false
    };
  }

  public departmentInitializeDetailsViewState(): IDepartmentDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public departmentFilterViewModelToModel(source: IDepartmentFilterViewModel): IDepartmentFilterModel {
    let destination = {} as IDepartmentFilterViewModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }

  public departmentViewModelToCommissionTeachersFilterModel(source: IDepartmentViewModel): IDepartmentTeachersFilterModel {
    let destination = {} as IDepartmentTeachersFilterModel;

    if (!isNil(source)) {
      destination = {
        departmentId: source.id,
        showDeleted: source.isDeleted,
        showCascadeDeletedBy: source.isDeleted ? 'department' : undefined
      };
    }

    return destination;
  }
}
