import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface ITeacherListViewModel {
  id: number;
  name: string;
  isDeleted: boolean;
  email: string;
  academicDegree?: IdNameSimpleItem;
  academicTitle?: IdNameSimpleItem;
  commission: IdNameSimpleItem;
  department: IdNameSimpleItem;
  teacherRank?: IdNameSimpleItem;
}
