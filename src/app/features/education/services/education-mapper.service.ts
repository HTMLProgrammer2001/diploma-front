import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IEducationListViewModel} from '../types/view-model/education-list-view-model';
import {IEducationViewModel} from '../types/view-model/education-view-model';
import {IEducationFilterViewModel} from '../types/view-model/education-filter-view-model';
import {IEducationGetModel} from '../types/model/education-get-model';
import {IEducationPutModel} from '../types/model/education-put-model';
import {IEducationPostModel} from '../types/model/education-post-model';
import {IEducationDetailsViewState} from '../types/view-model/education-details-view-state';
import {IEducationFilterModel} from '../types/model/education-filter-model';
import {IEducationListGetModel} from '../types/model/education-list-get-model';

@Injectable({
  providedIn: 'root',
})
export class EducationMapperService {
  public educationListGetModelToViewModel(source: IEducationListGetModel): IEducationListViewModel {
    let destination = {} as IEducationListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        educationQualification: source.educationQualification,
        teacher: source.teacher,
        specialty: source.specialty,
        yearOfIssue: source.yearOfIssue,
        institution: source.institution,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public educationGetModelToViewModel(source: IEducationGetModel): IEducationViewModel {
    let destination = {} as IEducationViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        educationQualification: source.educationQualification,
        teacher: source.teacher,
        institution: source.institution,
        specialty: source.specialty,
        yearOfIssue: source.yearOfIssue,
        description: source.description,
        guid: source.guid,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public educationViewModelToPutModel(source: IEducationViewModel): IEducationPutModel {
    let destination = {} as IEducationPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        educationQualificationId: source.educationQualification?.id,
        institution: source.institution,
        specialty: source.specialty,
        yearOfIssue: source.yearOfIssue,
        description: source.description,
        teacherId: source.teacher?.id,
        guid: source.guid
      };
    }

    return destination;
  }

  public educationViewModelToPostModel(source: IEducationViewModel): IEducationPostModel {
    let destination = {} as IEducationPostModel;

    if (!isNil(source)) {
      destination = {
        educationQualificationId: source.educationQualification?.id,
        description: source.description,
        teacherId: source.teacher?.id,
        institution: source.institution,
        specialty: source.specialty,
        yearOfIssue: source.yearOfIssue
      };
    }

    return destination;
  }

  public educationInitializeViewModel(): IEducationViewModel {
    return {
      id: null,
      educationQualification: {
        id: null,
        name: ''
      },
      teacher: {
        id: null,
        name: ''
      },
      specialty: '',
      description: '',
      yearOfIssue: null,
      institution: '',
      guid: null,
      isDeleted: false
    };
  }

  public educationInitializeFilterViewModel(): IEducationFilterViewModel {
    return {
      educationQualificationId: null,
      teacherId: null,
      institution: '',
      specialty: '',
      yearOfIssueLess: null,
      yearOfIssueMore: null,
      showDeleted: false
    };
  }

  public educationInitializeDetailsViewState(): IEducationDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public educationFilterViewModelToModel(source: IEducationFilterViewModel):
    IEducationFilterModel {
    let destination = {} as IEducationFilterModel;

    if (!isNil(source)) {
      destination = {
        educationQualificationId: source.educationQualificationId,
        specialty: source.specialty,
        teacherId: source.teacherId,
        yearOfIssueLess: source.yearOfIssueLess,
        yearOfIssueMore: source.yearOfIssueMore,
        institution: source.institution,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }
}
