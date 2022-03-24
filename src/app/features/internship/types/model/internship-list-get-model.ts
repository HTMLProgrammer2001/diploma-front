import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IInternshipListGetModel {
  id: number;
  code: string;
  title: string;
  from: string;
  to: string;
  teacher: IdNameSimpleItem;
  hours: number;
  place: string;
  isDeleted: boolean;
}
