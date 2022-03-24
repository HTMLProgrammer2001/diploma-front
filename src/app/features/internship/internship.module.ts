import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewEducationListComponent} from './views/view-education-list/view-education-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewEducationDetailsComponent} from './views/view-education-details/view-education-details.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {EducationRoutingModule} from './education-routing.module';

@NgModule({
  declarations: [
    ViewEducationListComponent,
    ViewEducationDetailsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    EducationRoutingModule,
  ],
})
export class EducationModule {
}
