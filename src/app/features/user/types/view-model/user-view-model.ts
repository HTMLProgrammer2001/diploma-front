import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IUserViewModel {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  avatar?: File;
  avatarUrl: string;
  role: IdNameSimpleItem;
  password: string;
  isDeleted: boolean;
  guid: string;
}
