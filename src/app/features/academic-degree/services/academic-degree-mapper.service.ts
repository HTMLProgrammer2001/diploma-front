import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IAcademicDegreeListGetModel} from '../types/model/academic-degree-list-get-model';
import {IAcademicDegreeListViewModel} from '../types/view-model/academic-degree-list-view-model';
import {IAcademicDegreeViewModel} from '../types/view-model/academic-degree-view-model';
import {IAcademicDegreePutModel} from '../types/model/academic-degree-put-model';
import {IAcademicDegreeGetModel} from '../types/model/academic-degree-get-model';
import {IAcademicDegreePostModel} from '../types/model/academic-degree-post-model';
import {IAcademicDegreeFilterViewModel} from '../types/view-model/academic-degree-filter-view-model';
import {IAcademicDegreeFilterModel} from '../types/model/academic-degree-filter-model';
import {IAcademicDegreeTeachersFilterModel} from '../types/model/academic-degree-teachers-filter-model';
import {IAcademicDegreeDetailsViewState} from '../types/view-model/academic-degree-details-view-state';

@Injectable({
  providedIn: 'root',
})
export class AcademicDegreeMapperService {
  public academicDegreeListGetModelToViewModel(source: IAcademicDegreeListGetModel): IAcademicDegreeListViewModel {
    let destination = {} as IAcademicDegreeListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public academicDegreeGetModelToViewModel(source: IAcademicDegreeGetModel): IAcademicDegreeViewModel {
    let destination = {} as IAcademicDegreeViewModel;

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

  public academicDegreeViewModelToPutModel(source: IAcademicDegreeViewModel): IAcademicDegreePutModel {
    let destination = {} as IAcademicDegreePutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        guid: source.guid
      };
    }

    return destination;
  }

  public academicDegreeViewModelToPostModel(source: IAcademicDegreeViewModel): IAcademicDegreePostModel {
    let destination = {} as IAcademicDegreePostModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
      };
    }

    return destination;
  }

  public academicDegreeInitializeViewModel(): IAcademicDegreeViewModel {
    return {
      id: null,
      name: '',
      guid: null,
      isDeleted: false
    };
  }

  public academicDegreeInitializeFilterViewModel(): IAcademicDegreeFilterViewModel {
    return {
      name: '',
      showDeleted: false
    };
  }

  public academicDegreeInitializeDetailsViewState(): IAcademicDegreeDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public academicDegreeFilterViewModelToModel(source: IAcademicDegreeFilterViewModel): IAcademicDegreeFilterModel {
    let destination = {} as IAcademicDegreeFilterViewModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }

  public academicDegreeViewModelToCommissionTeachersFilterModel(source: IAcademicDegreeViewModel): IAcademicDegreeTeachersFilterModel {
    let destination = {} as IAcademicDegreeTeachersFilterModel;

    if (!isNil(source)) {
      destination = {
        academicDegreeId: source.id,
        showCascadeDeletedBy: source.isDeleted ? 'academicDegree' : undefined
      };
    }

    return destination;
  }
}
