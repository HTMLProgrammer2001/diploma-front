import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface IEducationQualificationEducationViewModel {
  id: number;
  specialty: string;
  institution: string;
  yearOfIssue: number;
  teacher: IdNameSimpleItem;
}
