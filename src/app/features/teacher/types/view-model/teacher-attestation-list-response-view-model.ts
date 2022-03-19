import {IPaginator} from '../../../../shared/types/paginator';
import {ITeacherAttestationListViewModel} from './teacher-attestation-list-view-model';

export interface ITeacherAttestationListResponseViewModel extends IPaginator<ITeacherAttestationListViewModel> {
  lastAttestationDate: string;
  nextAttestationDate: string;
}
