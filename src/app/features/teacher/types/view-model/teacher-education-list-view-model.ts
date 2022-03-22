import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

export interface ITeacherEducationListViewModel {
  id: number;
  educationQualification: IdNameSimpleItem;
  institution: string;
  specialty: string;
  yearOfIssue: string;
}
