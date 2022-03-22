import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface ITeacherEducationListGetModel {
  id: number;
  educationQualification: IdNameSimpleItem;
  institution: string;
  specialty: string;
  yearOfIssue: string;
}
