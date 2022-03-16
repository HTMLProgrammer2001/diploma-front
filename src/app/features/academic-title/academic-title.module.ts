import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewAcademicTitleListComponent} from './views/view-academic-title-list/view-academic-title-list.component';
import {AcademicTitleRoutingModule} from './academic-title-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewAcademicDegreeDetailsComponent} from './views/view-academic-title-details/view-academic-degree-details.component';
import { AcademicTitleTeachersListComponent } from './components/academic-title-teachers-list/academic-title-teachers-list.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';

@NgModule({
  declarations: [
    ViewAcademicTitleListComponent,
    ViewAcademicDegreeDetailsComponent,
    AcademicTitleTeachersListComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    AcademicTitleRoutingModule,
  ],
})
export class AcademicTitleModule {
}
