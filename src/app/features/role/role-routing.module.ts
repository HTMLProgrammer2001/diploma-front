import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewRoleListComponent} from './views/view-role-list/view-role-list.component';
import {BookmarkProcessGuard} from '../../global/services/bookmark-process.guard';
import {ViewRoleDetailsComponent} from './views/view-role-details/view-role-details.component';
import {AuthGuard} from '../../global/services/auth/auth.guard';
import {PermissionsGuard} from '../../global/services/auth/permissions.guard';


export const routingPaths = {
  roleList: 'list',
  roleDetails: 'details/:id',
  roleNew: 'new',
};

const routes: Routes = [
  {
    path: routingPaths.roleList,
    component: ViewRoleListComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {
      allowPinning: true,
    },
  },
  {
    path: routingPaths.roleDetails,
    component: ViewRoleDetailsComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
  },
  {
    path: routingPaths.roleNew,
    component: ViewRoleDetailsComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
  },
  {
    path: '**',
    redirectTo: '/error/404',
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule {
}
