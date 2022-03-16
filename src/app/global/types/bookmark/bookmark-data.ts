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
}
