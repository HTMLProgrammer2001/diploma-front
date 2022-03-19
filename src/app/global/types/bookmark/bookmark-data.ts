/* eslint-disable max-len */
import {IPaginator} from '../../../shared/types/paginator';
import {ICommissionListViewModel} from '../../../features/commission/types/view-model/commission-list-view-model';
import {ICommissionViewModel} from '../../../features/commission/types/view-model/commission-view-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {IUserInfoProfileGetModel} from '../../components/user-info/types/user-info-profile-get-model';
import {IDepartmentListViewModel} from '../../../features/department/types/view-model/department-list-view-model';
import {IDepartmentViewModel} from '../../../features/department/types/view-model/department-view-model';
import {IAcademicDegreeListViewModel} from '../../../features/academic-degree/types/view-model/academic-degree-list-view-model';
import {IAcademicDegreeViewModel} from '../../../features/academic-degree/types/view-model/academic-degree-view-model';
import {IAcademicTitleViewModel} from '../../../features/academic-title/types/view-model/academic-title-view-model';
import {IAcademicTitleListViewModel} from '../../../features/academic-title/types/view-model/academic-title-list-view-model';
import {ITeachingRankListViewModel} from '../../../features/teaching-rank/types/view-model/teaching-rank-list-view-model';
import {ITeachingRankViewModel} from '../../../features/teaching-rank/types/view-model/teaching-rank-view-model';
import {ITeacherListViewModel} from '../../../features/teacher/types/view-model/teacher-list-view-model';
import {ITeacherViewModel} from '../../../features/teacher/types/view-model/teacher-view-model';
import {ITeacherAttestationListViewModel} from '../../../features/teacher/types/view-model/teacher-attestation-list-view-model';
import {ITeacherInternshipListViewModel} from '../../../features/teacher/types/view-model/teacher-internship-list-view-model';
import {ITeacherPublicationListViewModel} from '../../../features/teacher/types/view-model/teacher-publication-list-view-model';
import {ITeacherHonorListViewModel} from '../../../features/teacher/types/view-model/teacher-honor-list-view-model';
import {ITeacherRebukeListViewModel} from '../../../features/teacher/types/view-model/teacher-rebuke-list-view-model';
import {ITeacherEducationListViewModel} from '../../../features/teacher/types/view-model/teacher-education-list-view-model';
import {ITeacherInternshipListResponseViewModel} from '../../../features/teacher/types/view-model/teacher-internship-list-response-view-model';
import {ITeacherAttestationListResponseViewModel} from '../../../features/teacher/types/view-model/teacher-attestation-list-response-view-model';

export interface IBookmarkData {
  /** User info **/
  userInfo?: IUserInfoProfileGetModel;

  /** Commission **/
  commissionList?: IPaginator<ICommissionListViewModel>;
  commissionDetail?: ICommissionViewModel;
  commissionDetailCopy?: ICommissionViewModel;
  commissionTeachersList?: IPaginator<IdNameSimpleItem>;

  /** Department **/
  departmentList?: IPaginator<IDepartmentListViewModel>;
  departmentDetail?: IDepartmentViewModel;
  departmentDetailCopy?: IDepartmentViewModel;
  departmentTeachersList?: IPaginator<IdNameSimpleItem>;

  /** Academic degree **/
  academicDegreeList?: IPaginator<IAcademicDegreeListViewModel>;
  academicDegreeDetail?: IAcademicDegreeViewModel;
  academicDegreeDetailCopy?: IAcademicDegreeViewModel;
  academicDegreeTeachersList?: IPaginator<IdNameSimpleItem>;

  /** Academic degree **/
  academicTitleList?: IPaginator<IAcademicTitleListViewModel>;
  academicTitleDetail?: IAcademicTitleViewModel;
  academicTitleDetailCopy?: IAcademicTitleViewModel;
  academicTitleTeachersList?: IPaginator<IdNameSimpleItem>;

  /** Teaching rank **/
  teachingRankList?: IPaginator<ITeachingRankListViewModel>;
  teachingRankDetail?: ITeachingRankViewModel;
  teachingRankDetailCopy?: ITeachingRankViewModel;
  teachingRankTeachersList?: IPaginator<IdNameSimpleItem>;

  /** Teacher **/
  teacherList?: IPaginator<ITeacherListViewModel>;
  teacherDetail?: ITeacherViewModel;
  teacherDetailCopy?: ITeacherViewModel;
  teacherAttestationList?: ITeacherAttestationListResponseViewModel;
  teacherInternshipList?: ITeacherInternshipListResponseViewModel;
  teacherPublicationList?: IPaginator<ITeacherPublicationListViewModel>;
  teacherHonorList?: IPaginator<ITeacherHonorListViewModel>;
  teacherRebukeList?: IPaginator<ITeacherRebukeListViewModel>;
  teacherEducationList?: IPaginator<ITeacherEducationListViewModel>;
}
