import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewDepartmentListComponent} from './views/view-department-list/view-department-list.component';
import {DepartmentRoutingModule} from './department-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewDepartmentDetailsComponent} from './views/view-department-details/view-department-details.component';
import { DepartmentTeachersListComponent } from './components/department-teachers-list/department-teachers-list.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';

@NgModule({
  declarations: [
    ViewDepartmentListComponent,
    ViewDepartmentDetailsComponent,
    DepartmentTeachersListComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    DepartmentRoutingModule,
  ],
})
export class DepartmentModule {
}
