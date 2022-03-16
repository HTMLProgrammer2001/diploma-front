import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IAcademicTitleListViewModel} from '../types/view-model/academic-title-list-view-model';
import {IAcademicTitleViewModel} from '../types/view-model/academic-title-view-model';
import {IAcademicTitleFilterViewModel} from '../types/view-model/academic-title-filter-view-model';
import {IAcademicTitleGetModel} from '../types/model/academic-title-get-model';
import {IAcademicTitlePutModel} from '../types/model/academic-title-put-model';
import {IAcademicTitlePostModel} from '../types/model/academic-title-post-model';
import {IAcademicTitleDetailsViewState} from '../types/view-model/academic-title-details-view-state';
import {IAcademicTitleFilterModel} from '../types/model/academic-title-filter-model';
import {IAcademicTitleTeachersFilterModel} from '../types/model/academic-title-teachers-filter-model';
import {IAcademicTitleListGetModel} from '../types/model/academic-title-list-get-model';

@Injectable({
  providedIn: 'root',
})
export class AcademicTitleMapperService {
  public academicTitleListGetModelToViewModel(source: IAcademicTitleListGetModel): IAcademicTitleListViewModel {
    let destination = {} as IAcademicTitleListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public academicTitleGetModelToViewModel(source: IAcademicTitleGetModel): IAcademicTitleViewModel {
    let destination = {} as IAcademicTitleViewModel;

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

  public academicTitleViewModelToPutModel(source: IAcademicTitleViewModel): IAcademicTitlePutModel {
    let destination = {} as IAcademicTitlePutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        guid: source.guid
      };
    }

    return destination;
  }

  public academicTitleViewModelToPostModel(source: IAcademicTitleViewModel): IAcademicTitlePostModel {
    let destination = {} as IAcademicTitlePostModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
      };
    }

    return destination;
  }

  public academicTitleInitializeViewModel(): IAcademicTitleViewModel {
    return {
      id: null,
      name: '',
      guid: null,
      isDeleted: false
    };
  }

  public academicTitleInitializeFilterViewModel(): IAcademicTitleFilterViewModel {
    return {
      name: '',
      showDeleted: false
    };
  }

  public academicTitleInitializeDetailsViewState(): IAcademicTitleDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public academicTitleFilterViewModelToModel(source: IAcademicTitleFilterViewModel): IAcademicTitleFilterModel {
    let destination = {} as IAcademicTitleFilterModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }

  public academicTitleViewModelToTeachersFilterModel(source: IAcademicTitleViewModel): IAcademicTitleTeachersFilterModel {
    let destination = {} as IAcademicTitleTeachersFilterModel;

    if (!isNil(source)) {
      destination = {
        academicTitleId: source.id,
        showCascadeDeletedBy: source.isDeleted ? 'academicTitle' : undefined
      };
    }

    return destination;
  }
}
