/* eslint-disable max-len */
import {IPaginator} from '../../shared/types/paginator';
import {RoleListViewModel} from '../../features/role/types/view-model/role-list-view-model';
import {RoleDetailsViewModel} from '../../features/role/types/view-model/role-details-view-model';

export interface IBookmarkData {
  /** Admin role **/
  adminRoleList?: IPaginator<RoleListViewModel>;
  roleUserDetail?: RoleDetailsViewModel;
  roleUserDetailCopy?: RoleDetailsViewModel;
}
