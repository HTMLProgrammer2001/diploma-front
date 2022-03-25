import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IAttestationListViewModel} from '../types/view-model/attestation-list-view-model';
import {IAttestationViewModel} from '../types/view-model/attestation-view-model';
import {IAttestationFilterViewModel} from '../types/view-model/attestation-filter-view-model';
import {IAttestationGetModel} from '../types/model/attestation-get-model';
import {IAttestationPutModel} from '../types/model/attestation-put-model';
import {IAttestationPostModel} from '../types/model/attestation-post-model';
import {IAttestationDetailsViewState} from '../types/view-model/attestation-details-view-state';
import {IAttestationFilterModel} from '../types/model/attestation-filter-model';
import {IAttestationListGetModel} from '../types/model/attestation-list-get-model';

@Injectable({
  providedIn: 'root',
})
export class AttestationMapperService {
  public attestationListGetModelToViewModel(source: IAttestationListGetModel): IAttestationListViewModel {
    let destination = {} as IAttestationListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        category: source.category,
        teacher: source.teacher,
        date: source.date,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public attestationGetModelToViewModel(source: IAttestationGetModel): IAttestationViewModel {
    let destination = {} as IAttestationViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        date: source.date,
        teacher: source.teacher,
        category: source.category,
        description: source.description,
        guid: source.guid,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public attestationViewModelToPutModel(source: IAttestationViewModel): IAttestationPutModel {
    let destination = {} as IAttestationPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        date: source.date,
        description: source.description,
        categoryId: source.category.id,
        teacherId: source.teacher.id,
        guid: source.guid
      };
    }

    return destination;
  }

  public attestationViewModelToPostModel(source: IAttestationViewModel): IAttestationPostModel {
    let destination = {} as IAttestationPostModel;

    if (!isNil(source)) {
      destination = {
        date: source.date,
        description: source.description,
        teacherId: source.teacher.id,
        categoryId: source.category.id
      };
    }

    return destination;
  }

  public attestationInitializeViewModel(): IAttestationViewModel {
    return {
      id: null,
      teacher: {
        id: null,
        name: ''
      },
      date: '',
      category: {
        id: null,
        name: ''
      },
      description: '',
      guid: null,
      isDeleted: false
    };
  }

  public attestationInitializeFilterViewModel(): IAttestationFilterViewModel {
    return {
      categoryId: null,
      teacherId: null,
      dateLess: '',
      dateMore: '',
      showDeleted: false
    };
  }

  public attestationInitializeDetailsViewState(): IAttestationDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public attestationFilterViewModelToModel(source: IAttestationFilterViewModel): IAttestationFilterModel {
    let destination = {} as IAttestationFilterModel;

    if (!isNil(source)) {
      destination = {
        dateLess: source.dateLess || null,
        dateMore: source.dateMore || null,
        teacherId: source.teacherId,
        categoryId: source.categoryId,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }
}
