import {IPaginator} from '../../../../shared/types/paginator';
import {ITeacherInternshipListViewModel} from './teacher-internship-list-view-model';

export interface ITeacherInternshipListResponseViewModel extends IPaginator<ITeacherInternshipListViewModel> {
  lastAttestationInternshipHours: number;
}
