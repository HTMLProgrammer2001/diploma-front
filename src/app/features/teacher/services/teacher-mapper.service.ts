import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {ITeacherListViewModel} from '../types/view-model/teacher-list-view-model';
import {ITeacherViewModel} from '../types/view-model/teacher-view-model';
import {ITeacherFilterViewModel} from '../types/view-model/teacher-filter-view-model';
import {ITeacherGetModel} from '../types/model/teacher-get-model';
import {ITeacherPutModel} from '../types/model/teacher-put-model';
import {ITeacherPostModel} from '../types/model/teacher-post-model';
import {ITeacherDetailsViewState} from '../types/view-model/teacher-details-view-state';
import {ITeacherFilterModel} from '../types/model/teacher-filter-model';
import {ITeacherListGetModel} from '../types/model/teacher-list-get-model';
import {ICommonTeacherDataFilterGetModel} from '../types/model/common-teacher-data-filter-get-model';
import {ITeacherAttestationListGetModel} from '../types/model/teacher-attestation-list-get-model';
import {ITeacherAttestationListViewModel} from '../types/view-model/teacher-attestation-list-view-model';
import {ITeacherInternshipListGetModel} from '../types/model/teacher-internship-list-get-model';
import {ITeacherInternshipListViewModel} from '../types/view-model/teacher-internship-list-view-model';
import {ITeacherPublicationListGetModel} from '../types/model/teacher-publication-list-get-model';
import {ITeacherPublicationListViewModel} from '../types/view-model/teacher-publication-list-view-model';
import {ITeacherHonorListGetModel} from '../types/model/teacher-honor-list-get-model';
import {ITeacherHonorListViewModel} from '../types/view-model/teacher-honor-list-view-model';
import {ITeacherRebukeListGetModel} from '../types/model/teacher-rebuke-list-get-model';
import {ITeacherRebukeListViewModel} from '../types/view-model/teacher-rebuke-list-view-model';
import {ITeacherEducationListGetModel} from '../types/model/teacher-education-list-get-model';
import {ITeacherEducationListViewModel} from '../types/view-model/teacher-education-list-view-model';
import {ITeacherInternshipListResponseModel} from '../types/model/teacher-internship-list-response-model';
import {ITeacherInternshipListResponseViewModel} from '../types/view-model/teacher-internship-list-response-view-model';
import {ITeacherAttestationListResponseModel} from '../types/model/teacher-attestation-list-response-model';
import {ITeacherAttestationListResponseViewModel} from '../types/view-model/teacher-attestation-list-response-view-model';

@Injectable({
  providedIn: 'root',
})
export class TeacherMapperService {
  public teacherListGetModelToViewModel(source: ITeacherListGetModel): ITeacherListViewModel {
    let destination = {} as ITeacherListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        name: source.fullName,
        teacherRank: source.teacherRank,
        academicDegree: source.academicDegree,
        academicTitle: source.academicTitle,
        commission: source.commission,
        department: source.department,
        email: source.email,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public teacherGetModelToViewModel(source: ITeacherGetModel): ITeacherViewModel {
    let destination = {} as ITeacherViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        fullName: source.fullName,
        email: source.email,
        address: source.address,
        workStartDate: source.workStartDate,
        avatarUrl: source.avatarUrl,
        birthday: source.birthday,
        phone: source.phone,
        teacherRank: source.teacherRank,
        academicTitle: source.academicTitle,
        commission: source.commission,
        department: source.department,
        academicDegree: source.academicDegree,
        guid: source.guid,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public teacherViewModelToPutModel(source: ITeacherViewModel): ITeacherPutModel {
    let destination = {} as ITeacherPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        fullName: source.fullName,
        address: source.address,
        email: source.email,
        birthday: source.birthday,
        workStartDate: source.workStartDate,
        phone: source.phone,
        teacherRankId: source.teacherRank?.id,
        academicDegreeId: source.academicDegree?.id,
        academicTitleId: source.academicTitle?.id,
        commissionId: source.commission.id,
        departmentId: source.department.id,
        avatar: source.avatar,
        guid: source.guid
      };
    }

    return destination;
  }

  public teacherViewModelToPostModel(source: ITeacherViewModel): ITeacherPostModel {
    let destination = {} as ITeacherPostModel;

    if (!isNil(source)) {
      destination = {
        fullName: source.fullName,
        address: source.address,
        email: source.email,
        birthday: source.birthday,
        workStartDate: source.workStartDate,
        phone: source.phone,
        teacherRankId: source.teacherRank?.id,
        academicDegreeId: source.academicDegree?.id,
        academicTitleId: source.academicTitle?.id,
        commissionId: source.commission.id,
        departmentId: source.department.id,
        avatar: source.avatar,
      };
    }

    return destination;
  }

  public teacherInitializeViewModel(): ITeacherViewModel {
    return {
      id: null,
      phone: '',
      email: '',
      address: '',
      birthday: '',
      fullName: '',
      avatarUrl: '',
      workStartDate: '',
      academicTitle: {
        id: null,
        name: ''
      },
      academicDegree: {
        id: null,
        name: ''
      },
      department: {
        id: null,
        name: ''
      },
      commission: {
        id: null,
        name: ''
      },
      teacherRank: {
        id: null,
        name: ''
      },
      guid: null,
      isDeleted: false
    };
  }

  public teacherInitializeFilterViewModel(): ITeacherFilterViewModel {
    return {
      academicDegreeId: null,
      commissionId: null,
      academicTitleId: null,
      departmentId: null,
      teachingRankId: null,
      email: '',
      fullName: '',
      showDeleted: false
    };
  }

  public teacherInitializeDetailsViewState(): ITeacherDetailsViewState {
    return {
      isNotFound: false,
      restoring: false,
      panels: {
        personal: true,
        professional: false,
        attestations: false,
        internships: false,
        publications: false,
        honors: false,
        rebukes: false,
        educations: false
      }
    };
  }

  public teacherFilterViewModelToModel(source: ITeacherFilterViewModel): ITeacherFilterModel {
    let destination = {} as ITeacherFilterModel;

    if (!isNil(source)) {
      destination = {
        academicDegreeId: source.academicDegreeId,
        email: source.email,
        commissionId: source.commissionId,
        departmentId: source.departmentId,
        fullName: source.fullName,
        teachingRankId: source.teachingRankId,
        academicTitleId: source.academicTitleId,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }

  public teacherViewModelToCommonTeacherDataFilterModel(source: ITeacherViewModel): ICommonTeacherDataFilterGetModel {
    let destination = {} as ICommonTeacherDataFilterGetModel;

    if (!isNil(source)) {
      destination = {
        teacherId: source.id,
        showCascadeDeletedBy: source.isDeleted ? 'TEACHER' : null
      };
    }

    return destination;
  }

  public teacherAttestationListResponseModelToViewModel(source: ITeacherAttestationListResponseModel):
    ITeacherAttestationListResponseViewModel {
    let destination = {} as ITeacherAttestationListResponseViewModel;

    if (!isNil(source)) {
      destination = {
        ...source.attestationList,
        responseList: source.attestationList.responseList.map(el => this.teacherAttestationGetModelToViewModel(el)),
        lastAttestationDate: source.attestationDates.lastAttestationDate,
        nextAttestationDate: source.attestationDates.nextAttestationDate
      };
    }

    return destination;
  }

  public teacherAttestationGetModelToViewModel(source: ITeacherAttestationListGetModel): ITeacherAttestationListViewModel {
    let destination = {} as ITeacherAttestationListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        date: source.date,
        category: source.category
      };
    }

    return destination;
  }

  public teacherInternshipResponseToViewModel(source: ITeacherInternshipListResponseModel):
    ITeacherInternshipListResponseViewModel {
    let destination = {} as ITeacherInternshipListResponseViewModel;

    if (!isNil(source)) {
      destination = {
        ...source.internshipList,
        responseList: source.internshipList.responseList.map(el => this.teacherInternshipGetModelToViewModel(el)),
        lastAttestationInternshipHours: source.hoursFromLastAttestation.hours
      };
    }

    return destination;
  }

  public teacherInternshipGetModelToViewModel(source: ITeacherInternshipListGetModel): ITeacherInternshipListViewModel {
    let destination = {} as ITeacherInternshipListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        from: source.from,
        hours: source.hours,
        place: source.place,
        to: source.to,
        credits: source.credits ?? 0,
        title: source.title
      };
    }

    return destination;
  }

  public teacherPublicationGetModelToViewModel(source: ITeacherPublicationListGetModel): ITeacherPublicationListViewModel {
    let destination = {} as ITeacherPublicationListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        title: source.title,
        date: source.date
      };
    }

    return destination;
  }

  public teacherHonorGetModelToViewModel(source: ITeacherHonorListGetModel): ITeacherHonorListViewModel {
    let destination = {} as ITeacherHonorListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        title: source.title,
        date: source.date,
        orderNumber: source.orderNumber,
        isActive: source.isActive
      };
    }

    return destination;
  }

  public teacherRebukeGetModelToViewModel(source: ITeacherRebukeListGetModel): ITeacherRebukeListViewModel {
    let destination = {} as ITeacherRebukeListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        title: source.title,
        date: source.date,
        orderNumber: source.orderNumber,
        isActive: source.isActive
      };
    }

    return destination;
  }

  public teacherEducationGetModelToViewModel(source: ITeacherEducationListGetModel): ITeacherEducationListViewModel {
    let destination = {} as ITeacherEducationListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        educationQualification: source.educationQualification,
        institution: source.institution,
        specialty: source.specialty,
        yearOfIssue: source.yearOfIssue
      };
    }

    return destination;
  }
}
