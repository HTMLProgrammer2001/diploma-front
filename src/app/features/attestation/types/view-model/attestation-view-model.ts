import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IAttestationViewModel {
  id: number;
  date: string;
  description: string;
  teacher: IdNameSimpleItem;
  category: IdNameSimpleItem;
  guid: string;
  isDeleted: boolean;
}
