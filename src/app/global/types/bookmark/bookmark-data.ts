/* eslint-disable max-len */
import {IPaginator} from '../../../shared/types/paginator';
import {ICommissionListViewModel} from '../../../features/commission/types/view-model/commission-list-view-model';
import {ICommissionViewModel} from '../../../features/commission/types/view-model/commission-view-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {IUserInfoProfileGetModel} from '../../components/user-info/types/user-info-profile-get-model';

export interface IBookmarkData {
  /** User info **/
  userInfo?: IUserInfoProfileGetModel;

  /** Commission **/
  commissionList?: IPaginator<ICommissionListViewModel>;
  commissionDetail?: ICommissionViewModel;
  commissionDetailCopy?: ICommissionViewModel;
  commissionTeachersList?: IPaginator<IdNameSimpleItem>;
}
