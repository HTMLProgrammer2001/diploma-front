import {PaginatorRequest} from '../../shared/types/paginator-request';
import {Validator} from '../../shared/types/validation/validator';

export interface IBookmarkViewState {
  /** Admin role  **/
  adminRoleListPaginator?: PaginatorRequest;
  roleUserValidator?: Validator;
}
