/* eslint-disable max-len */
import {Validator} from '../../../shared/types/validation/validator';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {ICommissionFilterViewModel} from '../../../features/commission/types/view-model/commission-filter-view-model';
import {ICommissionDetailsViewState} from '../../../features/commission/types/view-model/commission-details-view-state';
import {IDepartmentFilterViewModel} from '../../../features/department/types/view-model/department-filter-view-model';
import {IDepartmentDetailsViewState} from '../../../features/department/types/view-model/department-details-view-state';
import {IAcademicDegreeFilterModel} from '../../../features/academic-degree/types/model/academic-degree-filter-model';
import {IAcademicDegreeDetailsViewState} from '../../../features/academic-degree/types/view-model/academic-degree-details-view-state';
import {IAcademicTitleDetailsViewState} from '../../../features/academic-title/types/view-model/academic-title-details-view-state';
import {IAcademicTitleFilterViewModel} from '../../../features/academic-title/types/view-model/academic-title-filter-view-model';
import {ITeachingRankFilterViewModel} from '../../../features/teaching-rank/types/view-model/teaching-rank-filter-view-model';
import {ITeachingRankDetailsViewState} from '../../../features/teaching-rank/types/view-model/teaching-rank-details-view-state';
import {ITeacherFilterViewModel} from '../../../features/teacher/types/view-model/teacher-filter-view-model';
import {ITeacherDetailsViewState} from '../../../features/teacher/types/view-model/teacher-details-view-state';
import {IEducationQualificationFilterViewModel} from '../../../features/education-qualification/types/view-model/education-qualification-filter-view-model';
import {IEducationQualificationDetailsViewState} from '../../../features/education-qualification/types/view-model/education-qualification-details-view-state';
import {IEducationFilterViewModel} from '../../../features/education/types/view-model/education-filter-view-model';
import {IEducationDetailsViewState} from '../../../features/education/types/view-model/education-details-view-state';
import {ICategoryFilterViewModel} from '../../../features/category/types/view-model/category-filter-view-model';
import {ICategoryDetailsViewState} from '../../../features/category/types/view-model/category-details-view-state';
import {IInternshipDetailsViewState} from '../../../features/internship/types/view-model/internship-details-view-state';
import {IInternshipFilterViewModel} from '../../../features/internship/types/view-model/internship-filter-view-model';
import {IAttestationFilterViewModel} from '../../../features/attestation/types/view-model/attestation-filter-view-model';
import {IAttestationDetailsViewState} from '../../../features/attestation/types/view-model/attestation-details-view-state';
import {IPublicationFilterViewModel} from '../../../features/publication/types/view-model/publication-filter-view-model';
import {IPublicationDetailsViewState} from '../../../features/publication/types/view-model/publication-details-view-state';
import {IHonorFilterViewModel} from '../../../features/honor/types/view-model/honor-filter-view-model';
import {IHonorDetailsViewState} from '../../../features/honor/types/view-model/honor-details-view-state';
import {IRebukeFilterViewModel} from '../../../features/rebuke/types/view-model/rebuke-filter-view-model';
import {IRebukeDetailsViewState} from '../../../features/rebuke/types/view-model/rebuke-details-view-state';
import {IUserFilterViewModel} from '../../../features/user/types/view-model/user-filter-view-model';
import {IUserDetailsViewState} from '../../../features/user/types/view-model/user-details-view-state';
import {IGenerateReportFilterViewModel} from '../../../features/export/types/view-model/generate-report-filter-view-model';
import {IImportBodyViewModel} from '../../../features/import/types/view-model/import-body-view-model';

export interface IBookmarkViewState {
  /** Commission  **/
  commissionListPaginator?: IPaginatorBase;
  commissionFilter?: ICommissionFilterViewModel;
  commissionValidator?: Validator;
  commissionDetails?: ICommissionDetailsViewState;
  commissionTeachersListPaginator?: IPaginatorBase;

  /** Department  **/
  departmentListPaginator?: IPaginatorBase;
  departmentFilter?: IDepartmentFilterViewModel;
  departmentValidator?: Validator;
  departmentDetails?: IDepartmentDetailsViewState;
  departmentTeachersListPaginator?: IPaginatorBase;

  /** Academic degree  **/
  academicDegreeListPaginator?: IPaginatorBase;
  academicDegreeFilter?: IAcademicDegreeFilterModel;
  academicDegreeValidator?: Validator;
  academicDegreeDetails?: IAcademicDegreeDetailsViewState;
  academicDegreeTeachersListPaginator?: IPaginatorBase;

  /** Academic title  **/
  academicTitleListPaginator?: IPaginatorBase;
  academicTitleFilter?: IAcademicTitleFilterViewModel;
  academicTitleValidator?: Validator;
  academicTitleDetails?: IAcademicTitleDetailsViewState;
  academicTitleTeachersListPaginator?: IPaginatorBase;

  /** Teaching rank  **/
  teachingRankListPaginator?: IPaginatorBase;
  teachingRankFilter?: ITeachingRankFilterViewModel;
  teachingRankValidator?: Validator;
  teachingRankDetails?: ITeachingRankDetailsViewState;
  teachingRankTeachersListPaginator?: IPaginatorBase;

  /** Teacher  **/
  teacherListPaginator?: IPaginatorBase;
  teacherFilter?: ITeacherFilterViewModel;
  teacherValidator?: Validator;
  teacherDetails?: ITeacherDetailsViewState;
  teacherAttestationListPaginator?: IPaginatorBase;
  teacherInternshipListPaginator?: IPaginatorBase;
  teacherPublicationListPaginator?: IPaginatorBase;
  teacherHonorListPaginator?: IPaginatorBase;
  teacherRebukeListPaginator?: IPaginatorBase;
  teacherEducationListPaginator?: IPaginatorBase;

  /** Education qualification  **/
  educationQualificationListPaginator?: IPaginatorBase;
  educationQualificationFilter?: IEducationQualificationFilterViewModel;
  educationQualificationValidator?: Validator;
  educationQualificationDetails?: IEducationQualificationDetailsViewState;
  educationQualificationEducationsListPaginator?: IPaginatorBase;

  /** Education  **/
  educationListPaginator?: IPaginatorBase;
  educationFilter?: IEducationFilterViewModel;
  educationValidator?: Validator;
  educationDetails?: IEducationDetailsViewState;

  /** Category  **/
  categoryListPaginator?: IPaginatorBase;
  categoryFilter?: ICategoryFilterViewModel;
  categoryValidator?: Validator;
  categoryDetails?: ICategoryDetailsViewState;
  categoryAttestationsListPaginator?: IPaginatorBase;

  /** Internship  **/
  internshipListPaginator?: IPaginatorBase;
  internshipFilter?: IInternshipFilterViewModel;
  internshipValidator?: Validator;
  internshipDetails?: IInternshipDetailsViewState;

  /** Attestation  **/
  attestationListPaginator?: IPaginatorBase;
  attestationFilter?: IAttestationFilterViewModel;
  attestationValidator?: Validator;
  attestationDetails?: IAttestationDetailsViewState;

  /** Publication  **/
  publicationListPaginator?: IPaginatorBase;
  publicationFilter?: IPublicationFilterViewModel;
  publicationValidator?: Validator;
  publicationDetails?: IPublicationDetailsViewState;

  /** Honor  **/
  honorListPaginator?: IPaginatorBase;
  honorFilter?: IHonorFilterViewModel;
  honorValidator?: Validator;
  honorDetails?: IHonorDetailsViewState;

  /** Rebuke  **/
  rebukeListPaginator?: IPaginatorBase;
  rebukeFilter?: IRebukeFilterViewModel;
  rebukeValidator?: Validator;
  rebukeDetails?: IRebukeDetailsViewState;

  /** User  **/
  userListPaginator?: IPaginatorBase;
  userFilter?: IUserFilterViewModel;
  userValidator?: Validator;
  userDetails?: IUserDetailsViewState;

  /** Profile **/
  profileValidator?: Validator;

  /** Export **/
  exportValidator?: Validator;

  /** Import **/
  importValidator?: Validator;

  /** Notification **/
  notificationValidator?: Validator;
  notificationTeachersPaginator?: IPaginatorBase;
}
