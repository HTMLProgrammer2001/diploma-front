import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface ITeacherListGetModel {
  id: number;
  fullName: string;
  isDeleted: boolean;
  email: string;
  academicDegree?: IdNameSimpleItem;
  academicTitle?: IdNameSimpleItem;
  commission: IdNameSimpleItem;
  department: IdNameSimpleItem;
  teacherRank?: IdNameSimpleItem;
}
