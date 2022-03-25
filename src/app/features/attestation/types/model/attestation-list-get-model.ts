import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IAttestationListGetModel {
  id: number;
  date: string;
  teacher: IdNameSimpleItem;
  category: IdNameSimpleItem;
  isDeleted: boolean;
}
