export interface IInternshipPutModel {
  id: number;
  guid: string;
  title: string;
  from: string;
  to: string;
  code: string;
  place: string;
  description: string;
  hours: number;
  credits: number;
  teacherId: number;
}
