export interface IGenerateReportFilterModel {
  commissionId: number;
  departmentId: number;
  teacherIds: Array<number>;
  from: string;
  to: string;
  select: Array<number>;
}
