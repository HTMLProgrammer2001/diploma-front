export interface ITeacherPutModel {
  id: number;
  guid: string;
  academicDegreeId?: number;
  academicTitleId?: number;
  address?: string;
  avatar?: File;
  birthday?: string;
  commissionId?: number;
  departmentId?: number;
  email?: string;
  fullName?: string;
  phone?: string;
  teacherRankId?: number;
  workStartDate?: string;
}
