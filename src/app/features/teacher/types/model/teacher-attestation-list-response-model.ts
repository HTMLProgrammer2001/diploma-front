import {IPaginator} from '../../../../shared/types/paginator';
import {ITeacherAttestationListGetModel} from './teacher-attestation-list-get-model';

export interface ITeacherAttestationListResponseModel {
  attestationList: IPaginator<ITeacherAttestationListGetModel>;
  attestationDates: {lastAttestationDate: string; nextAttestationDate: string};
}
