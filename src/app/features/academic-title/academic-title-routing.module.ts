import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewAcademicTitleListComponent} from './views/view-academic-title-list/view-academic-title-list.component';
import {BookmarkProcessGuard} from '../../global/services/bookmark/bookmark-process.guard';
import {ViewAcademicDegreeDetailsComponent} from './views/view-academic-title-details/view-academic-degree-details.component';
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
    component: ViewAcademicTitleListComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {allowPinning: true, roles: readRoles},
  },
  {
    matcher: matchId(routingPaths.commissionDetails),
    component: ViewAcademicDegreeDetailsComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {roles: readRoles}
  },
  {
    path: routingPaths.commissionNew,
    component: ViewAcademicDegreeDetailsComponent,
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
export class AcademicTitleRoutingModule {
}
