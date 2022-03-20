import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewEducationQualificationListComponent} from './views/view-education-qualification-list/view-education-qualification-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewEducationQualificationDetailsComponent} from './views/view-education-qualification-details/view-education-qualification-details.component';
import { EducationQualificationEducationsListComponent } from './components/education-qualification-educations-list/education-qualification-educations-list.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {EducationQualificationRoutingModule} from './education-qualification-routing.module';

@NgModule({
  declarations: [
    ViewEducationQualificationListComponent,
    ViewEducationQualificationDetailsComponent,
    EducationQualificationEducationsListComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    EducationQualificationRoutingModule,
  ],
})
export class EducationQualificationModule {
}
