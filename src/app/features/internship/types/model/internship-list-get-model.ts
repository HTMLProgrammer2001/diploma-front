import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IEducationListGetModel {
  id: number;
  educationQualification: IdNameSimpleItem;
  institution: string;
  isDeleted: boolean;
  specialty: string;
  teacher: IdNameSimpleItem;
  yearOfIssue: number;
}
