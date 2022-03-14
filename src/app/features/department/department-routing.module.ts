import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewDepartmentListComponent} from './views/view-department-list/view-department-list.component';
import {BookmarkProcessGuard} from '../../global/services/bookmark/bookmark-process.guard';
import {ViewDepartmentDetailsComponent} from './views/view-department-details/view-department-details.component';
import {AuthGuard} from '../../global/services/auth/auth.guard';
import {PermissionsGuard} from '../../global/services/auth/permissions.guard';
import {readRoles, writeRoles} from '../../shared/roles';
import {ViewPageNotFoundComponent} from '../../global/components/errors/view-page-not-found/view-page-not-found.component';
import {matchId} from '../../shared/utils';


export const routingPaths = {
  commissionList: 'list',
  commissionDetails: 'details/:id',
  commissionNew: 'new',
};

const routes: Routes = [
  {
    path: routingPaths.commissionList,
    component: ViewDepartmentListComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {allowPinning: true, roles: readRoles},
  },
  {
    matcher: matchId(routingPaths.commissionDetails),
    component: ViewDepartmentDetailsComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {roles: readRoles}
  },
  {
    path: routingPaths.commissionNew,
    component: ViewDepartmentDetailsComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {roles: writeRoles}
  },
  {
    path: '**',
    component: ViewPageNotFoundComponent,
    canActivate: [BookmarkProcessGuard, AuthGuard],
    canDeactivate: [BookmarkProcessGuard],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentRoutingModule {
}
