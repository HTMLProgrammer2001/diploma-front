import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {ITeachingRankListViewModel} from '../types/view-model/teaching-rank-list-view-model';
import {ITeachingRankViewModel} from '../types/view-model/teaching-rank-view-model';
import {ITeachingRankFilterViewModel} from '../types/view-model/teaching-rank-filter-view-model';
import {ITeachingRankGetModel} from '../types/model/teaching-rank-get-model';
import {ITeachingRankPutModel} from '../types/model/teaching-rank-put-model';
import {ITeachingRankPostModel} from '../types/model/teaching-rank-post-model';
import {ITeachingRankDetailsViewState} from '../types/view-model/teaching-rank-details-view-state';
import {ITeachingRankFilterModel} from '../types/model/teaching-rank-filter-model';
import {ITeachingRankTeachersFilterModel} from '../types/model/teaching-rank-teachers-filter-model';
import {ITeachingRankListGetModel} from '../types/model/teaching-rank-list-get-model';

@Injectable({
  providedIn: 'root',
})
export class TeachingRankMapperService {
  public teachingRankListGetModelToViewModel(source: ITeachingRankListGetModel): ITeachingRankListViewModel {
    let destination = {} as ITeachingRankListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public teachingRankGetModelToViewModel(source: ITeachingRankGetModel): ITeachingRankViewModel {
    let destination = {} as ITeachingRankViewModel;

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

  public teachingRankViewModelToPutModel(source: ITeachingRankViewModel): ITeachingRankPutModel {
    let destination = {} as ITeachingRankPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        guid: source.guid
      };
    }

    return destination;
  }

  public teachingRankViewModelToPostModel(source: ITeachingRankViewModel): ITeachingRankPostModel {
    let destination = {} as ITeachingRankPostModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
      };
    }

    return destination;
  }

  public teachingRankInitializeViewModel(): ITeachingRankViewModel {
    return {
      id: null,
      name: '',
      guid: null,
      isDeleted: false
    };
  }

  public teachingRankInitializeFilterViewModel(): ITeachingRankFilterViewModel {
    return {
      name: '',
      showDeleted: false
    };
  }

  public teachingRankInitializeDetailsViewState(): ITeachingRankDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public teachingRankFilterViewModelToModel(source: ITeachingRankFilterViewModel): ITeachingRankFilterModel {
    let destination = {} as ITeachingRankFilterModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }

  public teachingRankViewModelToTeachersFilterModel(source: ITeachingRankViewModel): ITeachingRankTeachersFilterModel {
    let destination = {} as ITeachingRankTeachersFilterModel;

    if (!isNil(source)) {
      destination = {
        teachingRankId: source.id,
        showCascadeDeletedBy: source.isDeleted ? 'teachingRank' : undefined
      };
    }

    return destination;
  }
}
