import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IAttestationListViewModel {
  id: number;
  date: string;
  teacher: IdNameSimpleItem;
  category: IdNameSimpleItem;
  isDeleted: boolean;
}
