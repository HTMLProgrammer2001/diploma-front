import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IEducationQualificationEducationGetModel {
  id: number;
  specialty: string;
  institution: string;
  yearOfIssue: number;
  teacher: IdNameSimpleItem;
}
