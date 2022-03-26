import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IPublicationListGetModel {
  id: number;
  title: string;
  date: string;
  anotherAuthors: string;
  teachers: Array<IdNameSimpleItem>;
  isDeleted: boolean;
}
