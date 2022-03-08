import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewRoleListComponent} from './views/view-role-list/view-role-list.component';
import {RoleRoutingModule} from './role-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewRoleDetailsComponent} from './views/view-role-details/view-role-details.component';

@NgModule({
  declarations: [
    ViewRoleListComponent,
    ViewRoleDetailsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    RoleRoutingModule,
  ],
})
export class RoleAdminModule {
}
