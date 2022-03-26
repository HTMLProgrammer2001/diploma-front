export interface IPublicationFilterModel {
  title: string;
  teacherIds: Array<number>;
  dateMore: string;
  dateLess: string;
  showDeleted: boolean;
}
