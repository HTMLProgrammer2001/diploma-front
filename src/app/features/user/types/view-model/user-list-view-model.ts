import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IUserListViewModel {
  id: number;
  fullName: string;
  email: string;
  role: IdNameSimpleItem;
  isDeleted: boolean;
}
