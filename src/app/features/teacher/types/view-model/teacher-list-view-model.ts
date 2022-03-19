export interface ITeacherListViewModel {
  id: number;
  name: string;
  isDeleted: boolean;
  email: string;
  academicDegree?: string;
  academicTitle?: string;
  commission: string;
  department: string;
  teacherRank?: string;
}
