import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IUserGetModel {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: IdNameSimpleItem;
  isDeleted: boolean;
  guid: string;
}
