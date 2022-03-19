import {IPaginator} from '../../../../shared/types/paginator';
import {ITeacherInternshipListGetModel} from './teacher-internship-list-get-model';

export interface ITeacherInternshipListResponseModel {
  internshipList: IPaginator<ITeacherInternshipListGetModel>;
  hoursFromLastAttestation: {hours: number};
}
