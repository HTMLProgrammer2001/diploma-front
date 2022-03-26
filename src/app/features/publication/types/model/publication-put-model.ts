export interface IPublicationPutModel {
  id: number;
  guid: string;
  title: string;
  date: string;
  publisher?: string;
  url?: string;
  anotherAuthors?: string;
  description?: string;
  teacherIds: Array<number>;
}
