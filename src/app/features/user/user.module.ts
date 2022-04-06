import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewUserListComponent} from './views/view-user-list/view-user-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewUserDetailsComponent} from './views/view-user-details/view-user-details.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {UserRoutingModule} from './user-routing.module';

@NgModule({
  declarations: [
    ViewUserListComponent,
    ViewUserDetailsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    UserRoutingModule,
  ],
})
export class UserModule {
}
