import {Validator} from '../../../shared/types/validation/validator';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {ICommissionFilterViewModel} from '../../../features/commission/types/view-model/commission-filter-view-model';
import {ICommissionDetailsViewState} from '../../../features/commission/types/view-model/commission-details-view-state';
import {IDepartmentFilterViewModel} from '../../../features/department/types/view-model/department-filter-view-model';
import {IDepartmentDetailsViewState} from '../../../features/department/types/view-model/department-details-view-state';

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
}
