import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IEducationQualificationListViewModel} from '../types/view-model/education-qualification-list-view-model';
import {IEducationQualificationViewModel} from '../types/view-model/education-qualification-view-model';
import {IEducationQualificationFilterViewModel} from '../types/view-model/education-qualification-filter-view-model';
import {IEducationQualificationGetModel} from '../types/model/education-qualification-get-model';
import {IEducationQualificationPutModel} from '../types/model/education-qualification-put-model';
import {IEducationQualificationPostModel} from '../types/model/education-qualification-post-model';
import {IEducationQualificationDetailsViewState} from '../types/view-model/education-qualification-details-view-state';
import {IEducationQualificationFilterModel} from '../types/model/education-qualification-filter-model';
import {IEducationQualificationEducationsFilterModel} from '../types/model/education-qualification-educations-filter-model';
import {IEducationQualificationListGetModel} from '../types/model/education-qualification-list-get-model';
import {IEducationQualificationEducationGetModel} from '../types/model/education-qualification-education-get-model';
import {IEducationQualificationEducationViewModel} from '../types/view-model/education-qualification-education-view-model';

@Injectable({
  providedIn: 'root',
})
export class EducationQualificationMapperService {
  public educationQualificationListGetModelToViewModel(source: IEducationQualificationListGetModel): IEducationQualificationListViewModel {
    let destination = {} as IEducationQualificationListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public educationQualificationGetModelToViewModel(source: IEducationQualificationGetModel): IEducationQualificationViewModel {
    let destination = {} as IEducationQualificationViewModel;

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

  public educationQualificationViewModelToPutModel(source: IEducationQualificationViewModel): IEducationQualificationPutModel {
    let destination = {} as IEducationQualificationPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.name,
        guid: source.guid
      };
    }

    return destination;
  }

  public educationQualificationViewModelToPostModel(source: IEducationQualificationViewModel): IEducationQualificationPostModel {
    let destination = {} as IEducationQualificationPostModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
      };
    }

    return destination;
  }

  public educationQualificationInitializeViewModel(): IEducationQualificationViewModel {
    return {
      id: null,
      name: '',
      guid: null,
      isDeleted: false
    };
  }

  public educationQualificationInitializeFilterViewModel(): IEducationQualificationFilterViewModel {
    return {
      name: '',
      showDeleted: false
    };
  }

  public educationQualificationInitializeDetailsViewState(): IEducationQualificationDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public educationQualificationFilterViewModelToModel(source: IEducationQualificationFilterViewModel):
    IEducationQualificationFilterModel {
    let destination = {} as IEducationQualificationFilterModel;

    if (!isNil(source)) {
      destination = {
        name: source.name,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }

  public educationQualificationViewModelToTeachersFilterModel(source: IEducationQualificationViewModel):
    IEducationQualificationEducationsFilterModel {
    let destination = {} as IEducationQualificationEducationsFilterModel;

    if (!isNil(source)) {
      destination = {
        educationQualificationId: source.id,
        showCascadeDeletedBy: source.isDeleted ? 'educationQualification' : undefined
      };
    }

    return destination;
  }

  educationQualificationEducationGetModelToViewModel(source: IEducationQualificationEducationGetModel):
    IEducationQualificationEducationViewModel {
    let destination = {} as IEducationQualificationEducationViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        institution: source.institution,
        specialty: source.specialty,
        yearOfIssue: source.yearOfIssue,
        teacher: source.teacher
      };
    }

    return destination;
  }
}
