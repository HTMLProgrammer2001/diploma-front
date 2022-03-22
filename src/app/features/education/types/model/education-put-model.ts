export interface IEducationPutModel {
  id: number;
  guid: string;
  description?: string;
  educationQualificationId: number;
  institution: string;
  specialty: string;
  teacherId: number;
  yearOfIssue: number;
}
