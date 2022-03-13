import {Validator} from '../../shared/types/validation/validator';
import {IPaginatorBase} from '../../shared/types/paginator-base';
import {ICommissionFilterViewModel} from '../../features/commission/types/view-model/commission-filter-view-model';

export interface IBookmarkViewState {
  /** Commission  **/
  commissionListPaginator?: IPaginatorBase;
  commissionFilter?: ICommissionFilterViewModel;
  commissionValidator?: Validator;
  commissionTeachersListPaginator?: IPaginatorBase;
}
