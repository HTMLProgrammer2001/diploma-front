import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {ICategoryListViewModel} from '../types/view-model/category-list-view-model';
import {ICategoryViewModel} from '../types/view-model/category-view-model';
import {ICategoryFilterViewModel} from '../types/view-model/category-filter-view-model';
import {ICategoryGetModel} from '../types/model/category-get-model';
import {ICategoryPutModel} from '../types/model/category-put-model';
import {ICategoryPostModel} from '../types/model/category-post-model';
import {ICategoryDetailsViewState} from '../types/view-model/category-details-view-state';
import {ICategoryFilterModel} from '../types/model/category-filter-model';
import {ICategoryListGetModel} from '../types/model/category-list-get-model';
import {ICategoryAttestationsFilterModel} from '../types/model/category-attestations-filter-model';

@Injectable({
  providedIn: 'root',
})
export class CategoryMapperService {
  public categoryListGetModelToViewModel(source: ICategoryListGetModel): ICategoryListViewModel {
    let destination = {} as ICategoryListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public categoryGetModelToViewModel(source: ICategoryGetModel): ICategoryViewModel {
    let destination = {} as ICategoryViewModel;

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

  public categoryViewModelToPutModel(source: ICategoryViewModel): ICategoryPutModel {
    let destination = {} as ICategoryPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        guid: source.guid
      };
    }

    return destination;
  }

  public categoryViewModelToPostModel(source: ICategoryViewModel): ICategoryPostModel {
    let destination = {} as ICategoryPostModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
      };
    }

    return destination;
  }

  public categoryInitializeViewModel(): ICategoryViewModel {
    return {
      id: null,
      name: '',
      guid: null,
      isDeleted: false
    };
  }

  public categoryInitializeFilterViewModel(): ICategoryFilterViewModel {
    return {
      name: '',
      showDeleted: false
    };
  }

  public categoryInitializeDetailsViewState(): ICategoryDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public categoryFilterViewModelToModel(source: ICategoryFilterViewModel): ICategoryFilterModel {
    let destination = {} as ICategoryFilterModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }

  public categoryViewModelToAttestationsFilterModel(source: ICategoryViewModel): ICategoryAttestationsFilterModel {
    let destination = {} as ICategoryAttestationsFilterModel;

    if (!isNil(source)) {
      destination = {
        categoryId: source.id,
        showCascadeDeletedBy: source.isDeleted ? 'CATEGORY' : undefined
      };
    }

    return destination;
  }
}
