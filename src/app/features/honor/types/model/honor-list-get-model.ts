import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IHonorListGetModel {
  id: number;
  title: string;
  date: string;
  orderNumber: string;
  isActive: boolean;
  isDeleted: boolean;
  teacher: IdNameSimpleItem;
}
