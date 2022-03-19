import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewTeacherListComponent} from './views/view-teacher-list/view-teacher-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewTeacherDetailsComponent} from './views/view-teacher-details/view-teacher-details.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {TeacherRoutingModule} from './teacher-routing.module';
import {TeacherAttestationsListComponent} from './components/teacher-attestations-list/teacher-attestations-list.component';
import {TeacherInternshipsListComponent} from './components/teacher-internships-list/teacher-internships-list.component';
import {TeacherPublicationsListComponent} from './components/teacher-publications-list/teacher-publications-list.component';
import {TeacherHonorsListComponent} from './components/teacher-honors-list/teacher-honors-list.component';
import {TeacherRebukesListComponent} from './components/teacher-rebukes-list/teacher-rebukes-list.component';
import {TeacherEducationsListComponent} from './components/teacher-educations-list/teacher-educations-list.component';

@NgModule({
  declarations: [
    ViewTeacherListComponent,
    ViewTeacherDetailsComponent,
    TeacherAttestationsListComponent,
    TeacherInternshipsListComponent,
    TeacherPublicationsListComponent,
    TeacherHonorsListComponent,
    TeacherRebukesListComponent,
    TeacherEducationsListComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    TeacherRoutingModule,
  ],
})
export class TeacherModule {
}
