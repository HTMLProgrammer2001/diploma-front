import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewRebukeListComponent} from './views/view-rebuke-list/view-rebuke-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewRebukeDetailsComponent} from './views/view-rebuke-details/view-rebuke-details.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {RebukeRoutingModule} from './rebuke-routing.module';

@NgModule({
  declarations: [
    ViewRebukeListComponent,
    ViewRebukeDetailsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    RebukeRoutingModule,
  ],
})
export class RebukeModule {
}
