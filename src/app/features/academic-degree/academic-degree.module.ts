import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewAcademicDegreeListComponent} from './views/view-academic-degree-list/view-academic-degree-list.component';
import {AcademicDegreeRoutingModule} from './academic-degree-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewAcademicDegreeDetailsComponent} from './views/view-academic-degree-details/view-academic-degree-details.component';
import { AcademicDegreeTeachersListComponent } from './components/academic-degree-teachers-list/academic-degree-teachers-list.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';

@NgModule({
  declarations: [
    ViewAcademicDegreeListComponent,
    ViewAcademicDegreeDetailsComponent,
    AcademicDegreeTeachersListComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    AcademicDegreeRoutingModule,
  ],
})
export class AcademicDegreeModule {
}
