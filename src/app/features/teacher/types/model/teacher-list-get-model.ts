import {NameSimpleItem} from '../../../../shared/types/name-simple-item';

export interface ITeacherListGetModel {
  id: number;
  fullName: string;
  isDeleted: boolean;
  email: string;
  academicDegree?: NameSimpleItem;
  academicTitle?: NameSimpleItem;
  commission: NameSimpleItem;
  department: NameSimpleItem;
  teacherRank?: NameSimpleItem;
}
