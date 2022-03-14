import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewCommissionListComponent} from './views/view-commission-list/view-commission-list.component';
import {CommissionRoutingModule} from './commission-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewCommissionDetailsComponent} from './views/view-commission-details/view-commission-details.component';
import { CommissionTeachersListComponent } from './components/commission-teachers-list/commission-teachers-list.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';

@NgModule({
  declarations: [
    ViewCommissionListComponent,
    ViewCommissionDetailsComponent,
    CommissionTeachersListComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    CommissionRoutingModule,
  ],
})
export class CommissionModule {
}
