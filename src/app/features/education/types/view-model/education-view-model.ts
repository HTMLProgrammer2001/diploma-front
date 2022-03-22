import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IEducationViewModel {
  id: number;
  guid: string;
  description: string;
  educationQualification: IdNameSimpleItem;
  institution: string;
  isDeleted: boolean;
  specialty: string;
  teacher: IdNameSimpleItem;
  yearOfIssue: number;
}
