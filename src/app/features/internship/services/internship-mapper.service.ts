import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IInternshipListViewModel} from '../types/view-model/internship-list-view-model';
import {IInternshipViewModel} from '../types/view-model/internship-view-model';
import {IInternshipFilterViewModel} from '../types/view-model/internship-filter-view-model';
import {IInternshipGetModel} from '../types/model/internship-get-model';
import {IInternshipPutModel} from '../types/model/internship-put-model';
import {IInternshipPostModel} from '../types/model/internship-post-model';
import {IInternshipDetailsViewState} from '../types/view-model/internship-details-view-state';
import {IInternshipFilterModel} from '../types/model/internship-filter-model';
import {IInternshipListGetModel} from '../types/model/internship-list-get-model';

@Injectable({
  providedIn: 'root',
})
export class EducationMapperService {
  public educationListGetModelToViewModel(source: IInternshipListGetModel): IInternshipListViewModel {
    let destination = {} as IInternshipListViewModel;

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

  public educationGetModelToViewModel(source: IInternshipGetModel): IInternshipViewModel {
    let destination = {} as IInternshipViewModel;

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

  public educationViewModelToPutModel(source: IInternshipViewModel): IInternshipPutModel {
    let destination = {} as IInternshipPutModel;

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

  public educationViewModelToPostModel(source: IInternshipViewModel): IInternshipPostModel {
    let destination = {} as IInternshipPostModel;

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

  public educationInitializeViewModel(): IInternshipViewModel {
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

  public educationInitializeFilterViewModel(): IInternshipFilterViewModel {
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

  public educationInitializeDetailsViewState(): IInternshipDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public educationFilterViewModelToModel(source: IInternshipFilterViewModel):
    IInternshipFilterModel {
    let destination = {} as IInternshipFilterModel;

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
