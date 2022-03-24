import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IInternshipGetModel {
  id: number;
  guid: string;
  code: string;
  title: string;
  from: string;
  to: string;
  teacher: IdNameSimpleItem;
  place: string;
  hours: number;
  credits: number;
  description: string;
  isDeleted: boolean;
}
