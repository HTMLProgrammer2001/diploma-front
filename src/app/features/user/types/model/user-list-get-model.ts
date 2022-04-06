import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IUserListGetModel {
  id: number;
  fullName: string;
  email: string;
  role: IdNameSimpleItem;
  isDeleted: boolean;
}
