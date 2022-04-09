export interface IGenerateReportFilterViewModel {
  type: number;
  commissionId: number;
  departmentId: number;
  teacherIds: Array<number>;
  from: string;
  to: string;
  select: Array<number>;
}
