import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface ITeacherGetModel {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  address?: string;
  birthday?: string;
  phone?: string;
  workStartDate?: string;
  academicDegree?: IdNameSimpleItem;
  academicTitle?: IdNameSimpleItem;
  commission: IdNameSimpleItem;
  department: IdNameSimpleItem;
  teacherRank?: IdNameSimpleItem;
  guid: string;
  isDeleted: boolean;
}
