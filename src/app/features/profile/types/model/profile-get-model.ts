import {NameSimpleItem} from '../../../../shared/types/name-simple-item';

export interface IProfileGetModel {
  avatarUrl: string;
  phone: string;
  email: string;
  fullName: string;
  role: NameSimpleItem;
  id: number;
  guid: string;
}
