export interface IPublicationPostModel {
  title: string;
  date: string;
  publisher?: string;
  url?: string;
  anotherAuthors?: string;
  description?: string;
  teacherIds: Array<number>;
}
