/* eslint-disable max-len */
import {IPaginator} from '../../shared/types/paginator';
import {ICommissionListViewModel} from '../../features/commission/types/view-model/commission-list-view-model';
import {ICommissionViewModel} from '../../features/commission/types/view-model/commission-view-model';
import {IdNameSimpleItem} from '../../shared/types/id-name-simple-item';

export interface IBookmarkData {
  /** Commission **/
  commissionList?: IPaginator<ICommissionListViewModel>;
  commissionDetail?: ICommissionViewModel;
  commissionDetailCopy?: ICommissionViewModel;
  commissionTeachersList?: IPaginator<IdNameSimpleItem>;
}
