import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewCommissionListComponent} from './views/view-commission-list/view-commission-list.component';
import {BookmarkProcessGuard} from '../../global/services/bookmark-process.guard';
import {ViewCommissionDetailsComponent} from './views/view-commission-details/view-commission-details.component';
import {AuthGuard} from '../../global/services/auth/auth.guard';
import {PermissionsGuard} from '../../global/services/auth/permissions.guard';
import {readRoles, writeRoles} from '../../shared/roles';


export const routingPaths = {
  commissionList: 'list',
  commissionDetails: 'details/:id',
  commissionNew: 'new',
};

const routes: Routes = [
  {
    path: routingPaths.commissionList,
    component: ViewCommissionListComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {allowPinning: true, roles: readRoles},
  },
  {
    path: routingPaths.commissionDetails,
    component: ViewCommissionDetailsComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {roles: readRoles}
  },
  {
    path: routingPaths.commissionNew,
    component: ViewCommissionDetailsComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {roles: writeRoles}
  },
  {
    path: '**',
    redirectTo: '/error/404',
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommissionRoutingModule {
}
