import {NameSimpleItem} from '../../../../shared/types/name-simple-item';

export interface ITeacherEducationListGetModel {
  id: number;
  educationQualification: NameSimpleItem;
  institution: string;
  specialty: string;
  yearOfIssue: string;
}
