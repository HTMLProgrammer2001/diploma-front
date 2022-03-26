import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IPublicationGetModel {
  id: number;
  title: string;
  date: string;
  publisher: string;
  anotherAuthors: string;
  teachers: Array<IdNameSimpleItem>;
  isDeleted: boolean;
  url: string;
  description: string;
  guid: string;
}
